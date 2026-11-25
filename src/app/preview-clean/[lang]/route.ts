import { NextRequest, NextResponse } from "next/server";
import { CLEAN_PREVIEW_COOKIE, CLEAN_CABEZADETORO_COOKIE, isLocalSandboxEnabled } from "@/lib/localSandbox";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ lang: string }> }
) {
  const { lang: rawLang } = await context.params;
  const lang = rawLang === "en" || rawLang === "fr" ? rawLang : "es";
  if (!isLocalSandboxEnabled()) {
    return new NextResponse(null, { status: 307, headers: { Location: `/${lang}` } });
  }
  const cdtParam = request.nextUrl.searchParams.get("cabezadetoro");
  const nextParam = request.nextUrl.searchParams.get("next");
  const safeTarget =
    nextParam && nextParam.startsWith("/") && !nextParam.startsWith("//") && !nextParam.startsWith("/preview-clean")
      ? nextParam
      : `/${lang}`;

  const res = new NextResponse(null, { status: 307, headers: { Location: safeTarget } });
  res.cookies.set(CLEAN_PREVIEW_COOKIE, "1", { path: "/", sameSite: "lax" });
  if (cdtParam === "include") {
    res.cookies.set(CLEAN_CABEZADETORO_COOKIE, "1", { path: "/", sameSite: "lax" });
  } else if (cdtParam === "exclude" || !request.cookies.get(CLEAN_CABEZADETORO_COOKIE)) {
    res.cookies.set(CLEAN_CABEZADETORO_COOKIE, "0", { path: "/", sameSite: "lax" });
  }
  return res;
}
