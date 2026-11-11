/** Thin fetch wrapper for the VoltEdge API. Responses are `{ data }`; errors are `{ error: { message } }`. */
export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api").replace(/\/+$/, "");

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function api<T>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method: init.method ?? "GET",
      headers: init.body !== undefined ? { "Content-Type": "application/json" } : undefined,
      body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
      // Server-side calls are cached by the caller ("use cache"); in the browser always ask for fresh data.
      ...(typeof window !== "undefined" ? { cache: "no-store" as const } : {}),
    });
  } catch {
    throw new ApiError(0, "We couldn't reach the store right now. Please try again in a moment.");
  }
  const json = (await res.json().catch(() => null)) as { data?: T; error?: { message?: string; details?: { path: string; message: string }[] } } | null;
  if (!res.ok) {
    const detail = json?.error?.details?.[0];
    throw new ApiError(res.status, detail ? `${detail.path}: ${detail.message}` : (json?.error?.message ?? `Request failed (${res.status})`));
  }
  return json?.data as T;
}

export const errorMessage = (e: unknown) => (e instanceof Error ? e.message : "Something went wrong. Please try again.");
