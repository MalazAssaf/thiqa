import TopNav from "@/src/components/layout/TopNav";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopNav />
      {children}
    </>
  );
}
