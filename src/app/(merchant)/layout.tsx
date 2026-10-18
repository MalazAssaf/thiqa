import StoreNav from "@/src/components/layout/StoreNav";

export default function MerchantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StoreNav />
      {children}
    </>
  );
}
