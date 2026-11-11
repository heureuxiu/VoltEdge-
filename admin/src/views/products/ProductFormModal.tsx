"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import type { AdminProductRow } from "@/types/admin";

const categories = ["iPhone", "Samsung", "Gadgets"];

interface Draft {
  name: string;
  spec: string;
  category: string;
  price: string;
  stock: string;
}

const empty: Draft = { name: "", spec: "", category: "iPhone", price: "", stock: "" };

export function ProductFormModal({
  open,
  product,
  onClose,
  onSave,
  onDelete,
}: {
  open: boolean;
  product: AdminProductRow | null;
  onClose: () => void;
  onSave: (data: Omit<AdminProductRow, "id" | "tint">, id?: string) => void | Promise<void>;
  onDelete?: (id: string) => void | Promise<void>;
}) {
  const [d, setD] = useState<Draft>(empty);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!open) return;
    setConfirmDelete(false);
    setD(product ? { name: product.name, spec: product.spec, category: product.category, price: String(product.price), stock: String(product.stock) } : empty);
  }, [open, product]);

  const set = (k: keyof Draft) => (e: { target: { value: string } }) => setD((x) => ({ ...x, [k]: e.target.value }));
  const valid = d.name.trim() && Number(d.price) > 0 && Number(d.stock) >= 0 && d.stock !== "";

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!valid) return;
    onSave({ name: d.name.trim(), spec: d.spec.trim(), category: d.category, price: Math.round(Number(d.price)), stock: Math.round(Number(d.stock)) }, product?.id);
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={product ? "Edit product" : "Add product"}
      description={product ? product.name : "New item for the storefront catalogue."}
      footer={
        <>
          {product && onDelete ? (
            confirmDelete ? (
              <Button variant="danger" className="mr-auto" onClick={() => onDelete(product.id)}>
                Confirm delete
              </Button>
            ) : (
              <Button variant="ghost" className="mr-auto text-danger" onClick={() => setConfirmDelete(true)}>
                Delete
              </Button>
            )
          ) : null}
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="accent" disabled={!valid} type="submit" form="product-form">
            {product ? "Save changes" : "Add product"}
          </Button>
        </>
      }
    >
      <form id="product-form" onSubmit={submit} className="grid gap-4">
        <Field label="Product name">
          <Input required value={d.name} onChange={set("name")} placeholder="iPhone 17 Pro Max" />
        </Field>
        <Field label="Spec" hint="Storage, condition or variant — shown under the name.">
          <Input value={d.spec} onChange={set("spec")} placeholder="256GB · New" />
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Category">
            <Select value={d.category} onChange={set("category")}>
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </Select>
          </Field>
          <Field label="Price (R)">
            <Input type="number" min={1} required value={d.price} onChange={set("price")} placeholder="24999" />
          </Field>
          <Field label="Stock">
            <Input type="number" min={0} required value={d.stock} onChange={set("stock")} placeholder="10" />
          </Field>
        </div>
      </form>
    </Modal>
  );
}
