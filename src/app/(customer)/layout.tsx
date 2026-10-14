import CustomerNav from "@/src/components/layout/CustomerNav";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <CustomerNav cartCount={2} />
      {children}
    </>
  );
}
