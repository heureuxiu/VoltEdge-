"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { useToast } from "@/components/ui/Toast";
import { api, ApiError, getToken, setToken } from "@/lib/api";
import type {
  ActivityEntry,
  AdminCustomer,
  AdminMessage,
  AdminOrder,
  AdminProductRow,
  AdminRepair,
  AdminTradeIn,
  OrderStatus,
  RepairStatus,
  StoreSettings,
  TradeInStatus,
} from "@/types/admin";

/* ------------------------------------------------------------------ */
/*  Server <-> admin shape adapters                                     */
/* ------------------------------------------------------------------ */

interface ServerProduct {
  id: string;
  name: string;
  spec: string;
  category: "iphone" | "samsung" | "gadgets";
  price: number;
  stock: number;
  active: boolean;
  image: string;
  compareAtPrice: number | null;
}

const CATEGORY_LABEL = { iphone: "iPhone", samsung: "Samsung", gadgets: "Gadgets" } as const;
const CATEGORY_VALUE: Record<string, ServerProduct["category"]> = { iPhone: "iphone", Samsung: "samsung", Gadgets: "gadgets" };
const tints = ["bg-accent-soft", "bg-hero-soft", "bg-surface-2", "bg-danger-soft"];

const toProduct = (p: ServerProduct, index: number): AdminProductRow => ({
  id: p.id,
  name: p.name,
  spec: p.spec,
  category: CATEGORY_LABEL[p.category] ?? p.category,
  price: p.price,
  stock: p.stock,
  tint: tints[index % tints.length]!,
  active: p.active,
  image: p.image,
  compareAtPrice: p.compareAtPrice,
});

interface Bootstrap {
  orders: AdminOrder[];
  products: ServerProduct[];
  repairs: AdminRepair[];
  tradeIns: AdminTradeIn[];
  customers: AdminCustomer[];
  activity: ActivityEntry[];
  messages: AdminMessage[];
  settings: StoreSettings;
  subscribers: number;
}

interface Data {
  orders: AdminOrder[];
  products: AdminProductRow[];
  repairs: AdminRepair[];
  tradeIns: AdminTradeIn[];
  customers: AdminCustomer[];
  activity: ActivityEntry[];
  messages: AdminMessage[];
  settings: StoreSettings;
  subscribers: number;
}

const emptySettings: StoreSettings = {
  storeName: "VoltEdge",
  supportEmail: "",
  whatsapp: "",
  lowStockThreshold: 5,
  standardShipping: 99,
  expressShipping: 199,
  notifyNewOrder: true,
  notifyLowStock: true,
  notifyRepairReady: true,
};

const emptyData: Data = {
  orders: [],
  products: [],
  repairs: [],
  tradeIns: [],
  customers: [],
  activity: [],
  messages: [],
  settings: emptySettings,
  subscribers: 0,
};

const fromBootstrap = (b: Bootstrap): Data => ({ ...b, products: b.products.map(toProduct) });

/* ------------------------------------------------------------------ */
/*  Store                                                               */
/* ------------------------------------------------------------------ */

interface Session {
  email: string;
  name: string;
}

type SignInResult = { ok: true } | { ok: false; message: string };

interface AdminStore extends Data {
  hydrated: boolean;
  session: Session | null;
  /** Set when the API could not be reached while restoring a session. */
  connectionError: string;
  signIn: (email: string, password: string) => Promise<SignInResult>;
  signOut: () => void;
  refresh: () => Promise<void>;
  setOrderStatus: (id: string, status: OrderStatus) => Promise<boolean>;
  addProduct: (p: Omit<AdminProductRow, "id" | "tint">) => Promise<boolean>;
  updateProduct: (id: string, patch: Partial<Omit<AdminProductRow, "id" | "tint">>) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  addRepair: (r: Omit<AdminRepair, "id" | "status">) => Promise<boolean>;
  setRepairStatus: (id: string, status: RepairStatus) => Promise<boolean>;
  setTradeInStatus: (id: string, status: TradeInStatus) => Promise<boolean>;
  updateSettings: (patch: Partial<StoreSettings>) => Promise<boolean>;
  setMessageHandled: (id: string, handled: boolean) => Promise<boolean>;
}

const Ctx = createContext<AdminStore | null>(null);

const POLL_MS = 30_000;

export function AdminStoreProvider({ children }: { children: ReactNode }) {
  const toast = useToast();
  const [data, setData] = useState<Data>(emptyData);
  const [session, setSession] = useState<Session | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [connectionError, setConnectionError] = useState("");

  const clearSession = useCallback(() => {
    setToken(null);
    setSession(null);
    setData(emptyData);
  }, []);

  const load = useCallback(async () => {
    const b = await api<Bootstrap>("/admin/bootstrap");
    setData(fromBootstrap(b));
  }, []);

  /** Runs an API call; on failure shows the message (and signs out when the token expired). */
  const run = useCallback(
    async <T,>(fn: () => Promise<T>): Promise<T | null> => {
      try {
        return await fn();
      } catch (e) {
        const err = e instanceof ApiError ? e : new ApiError(0, "Something went wrong.");
        if (err.status === 401) {
          clearSession();
          toast("Your session expired. Please sign in again.", "error");
        } else {
          toast(err.message, "error");
        }
        return null;
      }
    },
    [clearSession, toast],
  );

  // Restore the session from the saved token.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (getToken()) {
        try {
          const { user } = await api<{ user: { email: string; name: string } }>("/auth/me");
          await load();
          if (!cancelled) setSession({ email: user.email, name: user.name });
        } catch (e) {
          if (e instanceof ApiError && e.status === 0) setConnectionError(e.message);
          else setToken(null);
        }
      }
      if (!cancelled) setHydrated(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [load]);

  // Keep orders from the website fresh while the panel is open.
  useEffect(() => {
    if (!session) return;
    const tick = () => {
      if (document.visibilityState === "visible") load().catch(() => undefined);
    };
    const id = window.setInterval(tick, POLL_MS);
    document.addEventListener("visibilitychange", tick);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [session, load]);

  const signIn = useCallback<AdminStore["signIn"]>(
    async (email, password) => {
      try {
        const res = await api<{ token: string; user: { email: string; name: string } }>("/auth/login", { method: "POST", body: { email, password } });
        setToken(res.token);
        await load();
        setConnectionError("");
        setSession({ email: res.user.email, name: res.user.name });
        return { ok: true };
      } catch (e) {
        setToken(null);
        return { ok: false, message: e instanceof ApiError ? e.message : "Could not sign in." };
      }
    },
    [load],
  );

  const value = useMemo<AdminStore>(() => {
    const replace = <T extends { id: string }>(list: T[], item: T) => list.map((x) => (x.id === item.id ? item : x));
    // Reconcile with the server after a write (also refreshes the activity feed).
    const syncSoon = () => {
      load().catch(() => undefined);
    };

    return {
      ...data,
      hydrated,
      session,
      connectionError,
      signIn,
      signOut: clearSession,
      refresh: async () => {
        await run(load);
      },

      setOrderStatus: async (id, status) => {
        const res = await run(() => api<{ order: AdminOrder; products: ServerProduct[] }>(`/admin/orders/${id}/status`, { method: "PATCH", body: { status } }));
        if (!res) return false;
        setData((d) => {
          const changed = new Map(res.products.map((p) => [p.id, p]));
          return {
            ...d,
            orders: replace(d.orders, res.order),
            products: d.products.map((p, i) => (changed.has(p.id) ? toProduct(changed.get(p.id)!, i) : p)),
          };
        });
        syncSoon();
        return true;
      },

      addProduct: async (p) => {
        const res = await run(() =>
          api<ServerProduct>("/admin/products", {
            method: "POST",
            body: { name: p.name, spec: p.spec, category: CATEGORY_VALUE[p.category] ?? "gadgets", price: p.price, stock: p.stock },
          }),
        );
        if (!res) return false;
        setData((d) => ({ ...d, products: [...d.products, toProduct(res, d.products.length)] }));
        syncSoon();
        return true;
      },

      updateProduct: async (id, patch) => {
        const body: Record<string, unknown> = { ...patch };
        if (patch.category) body.category = CATEGORY_VALUE[patch.category] ?? "gadgets";
        const res = await run(() => api<ServerProduct>(`/admin/products/${id}`, { method: "PATCH", body }));
        if (!res) return false;
        setData((d) => ({ ...d, products: d.products.map((p, i) => (p.id === id ? toProduct(res, i) : p)) }));
        syncSoon();
        return true;
      },

      deleteProduct: async (id) => {
        const res = await run(() => api<{ id: string }>(`/admin/products/${id}`, { method: "DELETE" }));
        if (!res) return false;
        setData((d) => ({ ...d, products: d.products.filter((p) => p.id !== id) }));
        syncSoon();
        return true;
      },

      addRepair: async (r) => {
        const res = await run(() => api<AdminRepair>("/admin/repairs", { method: "POST", body: r }));
        if (!res) return false;
        setData((d) => ({ ...d, repairs: [res, ...d.repairs] }));
        syncSoon();
        return true;
      },

      setRepairStatus: async (id, status) => {
        const res = await run(() => api<AdminRepair>(`/admin/repairs/${id}`, { method: "PATCH", body: { status } }));
        if (!res) return false;
        setData((d) => ({ ...d, repairs: replace(d.repairs, res) }));
        syncSoon();
        return true;
      },

      setTradeInStatus: async (id, status) => {
        const res = await run(() => api<AdminTradeIn>(`/admin/trade-ins/${id}/status`, { method: "PATCH", body: { status } }));
        if (!res) return false;
        setData((d) => ({ ...d, tradeIns: replace(d.tradeIns, res) }));
        syncSoon();
        return true;
      },

      updateSettings: async (patch) => {
        const res = await run(() => api<StoreSettings>("/admin/settings", { method: "PUT", body: patch }));
        if (!res) return false;
        setData((d) => ({ ...d, settings: { ...d.settings, ...res } }));
        syncSoon();
        return true;
      },

      setMessageHandled: async (id, handled) => {
        const res = await run(() => api<AdminMessage>(`/admin/messages/${id}`, { method: "PATCH", body: { handled } }));
        if (!res) return false;
        setData((d) => ({ ...d, messages: replace(d.messages, res) }));
        return true;
      },
    };
  }, [data, hydrated, session, connectionError, signIn, clearSession, load, run]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAdmin() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAdmin must be used inside <AdminStoreProvider>");
  return ctx;
}
