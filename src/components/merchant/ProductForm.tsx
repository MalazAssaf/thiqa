"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ErrorIcon from "@mui/icons-material/Error";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import { api, BASE_URL } from "@/src/lib/api";

export type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string;
  stock: number;
};

const fieldLabel = "text-2xs leading-[1.3] text-neutral-500";
const control =
  "h-10 w-full min-w-0 rounded-md border border-divider bg-surface px-2.5 text-base text-text placeholder:text-neutral-600 outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 sm:h-9 sm:text-sm";
const controlError =
  "border-critical-text focus:border-critical-text focus:ring-critical-text/15";
const errorText = "text-xs leading-normal text-critical-text";

type Field = "name" | "price" | "stock" | "image";

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEdit = !!product;

  const [form, setForm] = useState({
    name: product?.name ?? "",
    description: product?.description ?? "",
    price: product ? String(product.price) : "",
    stock: product ? String(product.stock) : "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});

  const preview = image
    ? URL.createObjectURL(image)
    : product
      ? `${BASE_URL}${product.imageUrl}`
      : null;

  const save = useMutation({
    mutationFn: () => {
      const body = new FormData();
      body.append("name", form.name.trim());
      body.append("description", form.description.trim());
      body.append("price", form.price);
      body.append("stock", form.stock);
      if (image) body.append("image", image);

      return isEdit
        ? api<Product>(`/api/store/products/${product.id}`, {
            method: "PUT",
            body,
          })
        : api<Product>("/api/store/products", { method: "POST", body });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store", "products"] });
      // The list page shows the success snackbar based on this flag
      router.push(`/store/products?saved=${isEdit ? "updated" : "added"}`);
    },
  });

  function update(field: keyof typeof form, value: string) {
    setForm({ ...form, [field]: value });
    setErrors({ ...errors, [field]: undefined });
    save.reset();
  }

  function validate() {
    const e: Partial<Record<Field, string>> = {};
    if (!form.name.trim()) e.name = "Enter the product name.";
    if (!(Number(form.price) > 0)) e.price = "Enter a price greater than 0.";
    if (!/^\d+$/.test(form.stock)) e.stock = "Enter the stock (0 or more).";
    if (!isEdit && !image) e.image = "Add a product image.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) save.mutate();
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="flex w-full max-w-160 flex-col gap-4 rounded-lg bg-surface p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.07)] sm:p-6"
    >
      {/* Image */}
      <div className="flex flex-col gap-1.25">
        <span className={fieldLabel}>Product image</span>
        <label
          className={`flex cursor-pointer items-center gap-4 rounded-md border border-dashed p-3 hover:bg-accent-900 ${
            errors.image ? "border-critical-text" : "border-divider"
          }`}
        >
          <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-md bg-neutral-900">
            {preview ? (
              <img src={preview} alt="" className="size-full object-cover" />
            ) : (
              <ImageOutlinedIcon className="text-neutral-600" />
            )}
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium text-accent">
              {preview ? "Change image" : "Upload image"}
            </span>
            <span className="text-2xs text-neutral-500">
              JPG, PNG or WEBP · up to 2 MB
            </span>
          </div>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={(e) => {
              setImage(e.target.files?.[0] ?? null);
              setErrors({ ...errors, image: undefined });
              save.reset();
            }}
          />
        </label>
        {errors.image && <p className={errorText}>{errors.image}</p>}
      </div>

      {/* Name */}
      <div className="flex flex-col gap-1.25">
        <label htmlFor="name" className={fieldLabel}>
          Name
        </label>
        <input
          id="name"
          placeholder="Oud oil 12ml"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          aria-invalid={!!errors.name}
          className={`${control} ${errors.name ? controlError : ""}`}
        />
        {errors.name && <p className={errorText}>{errors.name}</p>}
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.25">
        <label htmlFor="description" className={fieldLabel}>
          Description (optional)
        </label>
        <textarea
          id="description"
          rows={3}
          maxLength={300}
          placeholder="What makes this product special?"
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          className="w-full rounded-md border border-divider bg-surface px-2.5 py-2 text-base text-text placeholder:text-neutral-600 outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 sm:text-sm"
        />
      </div>

      {/* Price + Stock */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex flex-1 flex-col gap-1.25">
          <label htmlFor="price" className={fieldLabel}>
            Price (SAR)
          </label>
          <input
            id="price"
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            placeholder="249.00"
            value={form.price}
            onChange={(e) => update("price", e.target.value)}
            aria-invalid={!!errors.price}
            className={`${control} ${errors.price ? controlError : ""}`}
          />
          {errors.price && <p className={errorText}>{errors.price}</p>}
        </div>

        <div className="flex flex-1 flex-col gap-1.25">
          <label htmlFor="stock" className={fieldLabel}>
            Stock
          </label>
          <input
            id="stock"
            type="number"
            inputMode="numeric"
            min="0"
            step="1"
            placeholder="15"
            value={form.stock}
            onChange={(e) => update("stock", e.target.value)}
            aria-invalid={!!errors.stock}
            className={`${control} ${errors.stock ? controlError : ""}`}
          />
          {errors.stock && <p className={errorText}>{errors.stock}</p>}
        </div>
      </div>

      {save.error && (
        <p role="alert" className={`flex items-center gap-1.5 ${errorText}`}>
          <ErrorIcon sx={{ fontSize: 16 }} />
          {save.error.message}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={save.isPending}
          className="flex h-11 flex-1 items-center justify-center rounded-md bg-accent px-3 text-sm font-medium text-cream hover:bg-accent-300 disabled:opacity-60 sm:h-9"
        >
          {save.isPending
            ? "Saving..."
            : isEdit
              ? "Save changes"
              : "Add product"}
        </button>
        <Link
          href="/store/products"
          className="flex h-11 flex-1 items-center justify-center rounded-md text-sm font-medium text-accent hover:bg-accent-900 sm:h-9"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
