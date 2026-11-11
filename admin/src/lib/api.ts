/** Thin fetch wrapper for the VoltEdge API. Responses are `{ data }`; errors are `{ error: { message } }`. */
export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api").replace(/\/+$/, "");

export const TOKEN_KEY = "ve-admin-token";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* storage unavailable */
  }
}

export async function api<T>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  const token = getToken();
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method: init.method ?? "GET",
      headers: { ...(init.body !== undefined ? { "Content-Type": "application/json" } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
      cache: "no-store",
    });
  } catch {
    throw new ApiError(0, "Can't reach the server. Is the API running?");
  }
  const json = (await res.json().catch(() => null)) as { data?: T; error?: { message?: string; details?: { path: string; message: string }[] } } | null;
  if (!res.ok) {
    const detail = json?.error?.details?.[0];
    throw new ApiError(res.status, detail ? `${detail.path}: ${detail.message}` : (json?.error?.message ?? `Request failed (${res.status})`));
  }
  return json?.data as T;
}
