import { proxyRequest } from "../../_utils/proxy";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  return proxyRequest(request, "/api/auth/login");
}


