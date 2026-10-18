import { NextResponse, type NextRequest } from "next/server";

function getRole(req: NextRequest): string | null {
  const token = req.cookies.get("thiqa_token")?.value;
  if (!token) return null;
  try {
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
    );
    if (payload.exp * 1000 < Date.now()) return null; // expired
    return payload.role ?? null;
  } catch {
    return null;
  }
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const role = getRole(req);
  const redirect = (path: string) =>
    NextResponse.redirect(new URL(path, req.url));

  const isStoreAuth =
    pathname.startsWith("/store/login") || pathname.startsWith("/store/signup");
  const isCustomerAuth =
    pathname === "/login" || pathname.startsWith("/signup");

  // Customer pages need a customer
  if (pathname.startsWith("/customer") && role !== "CUSTOMER") {
    return redirect(role === "STORE" ? "/store" : "/login");
  }

  // Store pages (except login/signup) need a store
  if (pathname.startsWith("/store") && !isStoreAuth && role !== "STORE") {
    return redirect(role === "CUSTOMER" ? "/customer/stores" : "/store/login");
  }

  // Already logged in: skip the auth pages
  if (isCustomerAuth && role === "CUSTOMER")
    return redirect("/customer/stores");
  if (isStoreAuth && role === "STORE") return redirect("/store");

  return NextResponse.next();
}

export const config = {
  matcher: ["/customer/:path*", "/store/:path*", "/login", "/signup/:path*"],
};
