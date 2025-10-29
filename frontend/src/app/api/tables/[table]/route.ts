import { proxyRequest } from "../../_utils/proxy";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, context: { params: Promise<{ table: string }> }) {
  const { table } = await context.params;
  return proxyRequest(request, `/api/tables/${encodeURIComponent(table)}`);
}


