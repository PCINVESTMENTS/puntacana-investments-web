import { NextResponse } from "next/server";
import { fetchLocalSandboxCatalog, isLocalSandboxEnabled } from "@/lib/localSandbox";

export async function GET() {
  if (!isLocalSandboxEnabled()) {
    return NextResponse.json({ results: [] }, { status: 404 });
  }
  const catalog = await fetchLocalSandboxCatalog();
  const list = (catalog?.properties || []).map((p: any) => ({
    id: p.id,
    slug: p.slug,
    title: p.internal_code ? `[${p.internal_code}] ${p.title}` : p.title,
    internal_code: p.internal_code || null,
    location: p.locationLabel || "Punta Cana",
    price: p.price || 0,
  }));
  return NextResponse.json({ results: list });
}
