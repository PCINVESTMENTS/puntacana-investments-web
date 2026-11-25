import { NextRequest, NextResponse } from "next/server";
import { CLEAN_PREVIEW_COOKIE, CLEAN_CABEZADETORO_COOKIE, isLocalSandboxEnabled } from "@/lib/localSandbox";

export async function GET(request: NextRequest) {
  if (!isLocalSandboxEnabled()) {
    return new NextResponse(null, { status: 307, headers: { Location: "/es" } });
  }
  const cdtParam = request.nextUrl.searchParams.get("cabezadetoro");
  const nextParam = request.nextUrl.searchParams.get("next");
  const safeTarget =
    nextParam && nextParam.startsWith("/") && !nextParam.startsWith("//") && !nextParam.startsWith("/preview-clean")
      ? nextParam
      : "/es";

  const res = new NextResponse(null, { status: 307, headers: { Location: safeTarget } });
  res.cookies.set(CLEAN_PREVIEW_COOKIE, "1", { path: "/", sameSite: "lax" });
  if (cdtParam === "include") {
    res.cookies.set(CLEAN_CABEZADETORO_COOKIE, "1", { path: "/", sameSite: "lax" });
  } else if (cdtParam === "exclude" || !request.cookies.get(CLEAN_CABEZADETORO_COOKIE)) {
    res.cookies.set(CLEAN_CABEZADETORO_COOKIE, "0", { path: "/", sameSite: "lax" });
  }
  return res;
}
