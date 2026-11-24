import { NextRequest, NextResponse } from "next/server";
import { fetchLocalSandboxCatalog, isLocalSandboxEnabled } from "@/lib/localSandbox";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(request: NextRequest) {
  if (!isLocalSandboxEnabled()) {
    return NextResponse.json({ ok: false, error: "Sandbox mode disabled" }, { status: 404 });
  }

  const slug = request.nextUrl.searchParams.get("slug") || "";
  if (!slug) {
    return NextResponse.json({ ok: false, error: "Missing slug" }, { status: 400, headers: CORS_HEADERS });
  }

  const catalog = await fetchLocalSandboxCatalog();
  if (!catalog) {
    return NextResponse.json(
      { ok: false, http_status: 503, error: "Local mirror unavailable" },
      { status: 503, headers: CORS_HEADERS }
    );
  }

  const found = catalog.properties.find((p) => p.slug === slug);
  if (!found) {
    return NextResponse.json(
      { ok: false, http_status: 404, error: `La ficha '${slug}' no está publicada aún en la copia local de la web.` },
      { status: 404, headers: CORS_HEADERS }
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://127.0.0.1:3111";
  return NextResponse.json(
    {
      ok: true,
      http_status: 200,
      slug,
      title: found.title,
      catalog_position: found.catalog_position,
      total_catalog_count: catalog.count,
      url_es: `${baseUrl}/es/properties/${slug}`,
      url_en: `${baseUrl}/en/properties/${slug}`,
      url_fr: `${baseUrl}/fr/properties/${slug}`,
      verified_at: new Date().toISOString(),
    },
    { status: 200, headers: CORS_HEADERS }
  );
}
