import Hero from "@/src/components/landing/Hero";
import TheScore from "@/src/components/landing/TheScore";
import ThiqaValues from "@/src/components/landing/ThiqaValues";
import Footer from "@/src/components/layout/Footer";

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <Hero />
      {/* What each side gets */}
      <ThiqaValues />
      {/* The score */}
      <TheScore />
      {/* Footer */}
      <Footer />
    </>
  );
}
