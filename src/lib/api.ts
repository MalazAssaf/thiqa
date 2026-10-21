export const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export async function api<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const isForm = options.body instanceof FormData;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: isForm
      ? options.headers
      : { "Content-Type": "application/json", ...options.headers },
  });

  const json = await res.json().catch(() => null);

  if (!res.ok || json?.status === "error") {
    throw new Error(json?.errors?.[0]?.message ?? "Something went wrong.");
  }

  return json.data as T;
}
