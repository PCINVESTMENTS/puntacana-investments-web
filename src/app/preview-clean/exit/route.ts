import { NextRequest, NextResponse } from "next/server";
import { CLEAN_PREVIEW_COOKIE, CLEAN_CABEZADETORO_COOKIE } from "@/lib/localSandbox";

export async function GET(request: NextRequest) {
  const nextParam = request.nextUrl.searchParams.get("next");
  const safeTarget =
    nextParam && nextParam.startsWith("/") && !nextParam.startsWith("//") && !nextParam.startsWith("/preview-clean")
      ? nextParam
      : "/es";

  const res = new NextResponse(null, { status: 307, headers: { Location: safeTarget } });
  res.cookies.delete(CLEAN_PREVIEW_COOKIE);
  res.cookies.delete(CLEAN_CABEZADETORO_COOKIE);
  return res;
}
