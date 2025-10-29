import { proxyRequest } from "../_utils/proxy";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return proxyRequest(request, "/api/history");
}


