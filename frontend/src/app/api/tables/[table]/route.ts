import { proxyRequest } from "../../_utils/proxy";

export const dynamic = "force-dynamic";

export async function GET(request: Request, context: { params: { table: string } }) {
  const { table } = context.params;
  return proxyRequest(request, `/api/tables/${encodeURIComponent(table)}`);
}


