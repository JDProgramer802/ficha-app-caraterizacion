import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/ficha") {
    const id = req.cookies.get("fichaId")?.value;
    if (id) {
      const url = req.nextUrl.clone();
      url.pathname = `/ficha/${id}`;
      return NextResponse.rewrite(url);
    }
  }

  if (pathname === "/admin/ficha") {
    const id = req.cookies.get("adminFichaId")?.value || req.cookies.get("fichaId")?.value;
    if (id) {
      const url = req.nextUrl.clone();
      url.pathname = `/admin/ficha/${id}`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/ficha", "/admin/ficha"]
};
