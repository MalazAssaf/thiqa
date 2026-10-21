import ProductForm from "@/src/components/merchant/ProductForm";

export default function NewProductPage() {
  return (
    <main className="min-h-[calc(100dvh-68px)] bg-bg pb-16">
      <div className="container-page flex flex-col gap-6 pt-8">
        <h1 className="font-display text-h2 font-semibold leading-[1.15] text-text">
          Add product
        </h1>
        <ProductForm />
      </div>
    </main>
  );
}
