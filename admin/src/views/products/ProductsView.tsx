"use client";

import { useMemo, useState } from "react";
import { Minus, Package, PencilSimple, Plus } from "@phosphor-icons/react";

import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { SearchBox } from "@/components/ui/SearchBox";
import { Segmented } from "@/components/ui/Segmented";
import { Table, Td, Th, Tr } from "@/components/ui/Table";
import { useToast } from "@/components/ui/Toast";
import { adminProductCategories } from "@/data/admin";
import { formatZar } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useAdmin } from "@/store/AdminStore";
import type { AdminProductRow } from "@/types/admin";
import { ProductFormModal } from "@/views/products/ProductFormModal";

type Cat = (typeof adminProductCategories)[number];

export function ProductsView() {
  const { products, settings, addProduct, updateProduct, deleteProduct } = useAdmin();
  const toast = useToast();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<Cat>("All");
  const [editing, setEditing] = useState<AdminProductRow | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const counts = useMemo(() => {
    const c: Partial<Record<Cat, number>> = { All: products.length };
    for (const p of products) c[p.category as Cat] = (c[p.category as Cat] ?? 0) + 1;
    return c;
  }, [products]);

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return products.filter((p) => (cat === "All" || p.category === cat) && (!term || `${p.name} ${p.spec}`.toLowerCase().includes(term)));
  }, [products, q, cat]);

  const inventoryValue = products.reduce((s, p) => s + p.price * p.stock, 0);
  const low = products.filter((p) => p.stock <= settings.lowStockThreshold).length;

  function openForm(p: AdminProductRow | null) {
    setEditing(p);
    setFormOpen(true);
  }

  return (
    <>
      <PageHeader
        description={`${products.length} products · ${formatZar(inventoryValue)} stock value · ${low} need restocking`}
        actions={
          <Button variant="accent" onClick={() => openForm(null)}>
            <Plus className="size-[18px]" weight="bold" aria-hidden /> Add product
          </Button>
        }
      />

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Segmented options={adminProductCategories} value={cat} onChange={setCat} counts={counts} />
        <SearchBox value={q} onChange={setQ} placeholder="Search products…" className="lg:w-72" />
      </div>

      <Card className="p-2 sm:p-3">
        {rows.length === 0 ? (
          <EmptyState icon={<Package className="size-6" aria-hidden />} title="No products found" text="Adjust the filters or add a new product." />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Product</Th>
                <Th>Category</Th>
                <Th className="text-right">Price</Th>
                <Th className="text-center">Stock</Th>
                <Th>Status</Th>
                <Th className="w-12" />
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => {
                const out = p.stock === 0;
                const lowStock = !out && p.stock <= settings.lowStockThreshold;
                return (
                  <Tr key={p.id}>
                    <Td>
                      <div className="flex items-center gap-3">
                        <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl text-muted", p.tint)}>
                          <Package className="size-5" aria-hidden />
                        </span>
                        <span className="min-w-0">
                          <b className="block truncate">{p.name}</b>
                          <span className="block truncate text-xs text-muted">{p.spec}</span>
                        </span>
                      </div>
                    </Td>
                    <Td className="text-ink-2">{p.category}</Td>
                    <Td className="text-right font-semibold tabular-nums">{formatZar(p.price)}</Td>
                    <Td>
                      <div className="mx-auto flex w-fit items-center rounded-xl border border-line">
                        <button
                          type="button"
                          aria-label={`Decrease stock of ${p.name}`}
                          disabled={out}
                          onClick={() => updateProduct(p.id, { stock: p.stock - 1 })}
                          className="grid size-8 place-items-center rounded-l-xl text-muted hover:bg-surface-2 hover:text-ink disabled:opacity-40"
                        >
                          <Minus className="size-3.5" weight="bold" aria-hidden />
                        </button>
                        <span className="w-9 text-center text-sm font-bold tabular-nums">{p.stock}</span>
                        <button
                          type="button"
                          aria-label={`Increase stock of ${p.name}`}
                          onClick={() => updateProduct(p.id, { stock: p.stock + 1 })}
                          className="grid size-8 place-items-center rounded-r-xl text-muted hover:bg-surface-2 hover:text-ink"
                        >
                          <Plus className="size-3.5" weight="bold" aria-hidden />
                        </button>
                      </div>
                    </Td>
                    <Td>
                      <Badge tone={out ? "danger" : lowStock ? "warn" : "ok"}>{out ? "Out of stock" : lowStock ? "Low stock" : "In stock"}</Badge>
                    </Td>
                    <Td>
                      <button
                        type="button"
                        aria-label={`Edit ${p.name}`}
                        onClick={() => openForm(p)}
                        className="grid size-9 place-items-center rounded-xl text-muted hover:bg-surface-2 hover:text-ink"
                      >
                        <PencilSimple className="size-[18px]" aria-hidden />
                      </button>
                    </Td>
                  </Tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </Card>

      <ProductFormModal
        open={formOpen}
        product={editing}
        onClose={() => setFormOpen(false)}
        onSave={async (data, id) => {
          const ok = id ? await updateProduct(id, data) : await addProduct(data);
          if (!ok) return;
          toast(`${data.name} ${id ? "updated" : "added"}`);
          setFormOpen(false);
        }}
        onDelete={async (id) => {
          if (!(await deleteProduct(id))) return;
          toast("Product removed");
          setFormOpen(false);
        }}
      />
    </>
  );
}
