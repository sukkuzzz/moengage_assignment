export async function proxyRequest(input: Request, targetPath: string, init?: RequestInit) {
  const backendBaseUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const url = new URL(targetPath, backendBaseUrl).toString();

  const headers = new Headers(input.headers);
  // Remove host header to avoid issues when proxying across domains
  headers.delete("host");

  const body = init?.body ?? (input.method !== "GET" && input.method !== "HEAD" ? await input.text() : undefined);

  const res = await fetch(url, {
    method: init?.method ?? input.method,
    headers,
    body,
    cache: "no-store",
    redirect: "follow",
  });

  const responseHeaders = new Headers(res.headers);
  // CORS not needed when same origin; ensure minimal headers
  responseHeaders.delete("transfer-encoding");

  const data = await res.arrayBuffer();
  return new Response(data, { status: res.status, statusText: res.statusText, headers: responseHeaders });
}


