"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { CartProvider } from "@/src/components/cart/CartProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>{children}</CartProvider>
    </QueryClientProvider>
  );
}
