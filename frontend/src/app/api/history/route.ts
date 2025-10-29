import { proxyRequest } from "../_utils/proxy";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  return proxyRequest(request, "/api/history");
}


