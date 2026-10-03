import LandingNav from "@/src/components/layout/LandingNav";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LandingNav />
      {children}
    </>
  );
}
