import { proxyRequest } from "../../_utils/proxy";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return proxyRequest(request, "/api/auth/login");
}


