import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "./src/utils/supabase/middleware";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  console.log("Middleware running for URL:", request.nextUrl.pathname);
  
  const response = NextResponse.next();
  
  // Cập nhật session
  // return await updateSession(request);
  
  // Bypass xác thực cho dev mode
  console.log("Auth check bypassed in middleware");
  return response;
}

// Áp dụng cho tất cả các route 
export const config = {
  matcher: [
    // Exclude files with a "." (e.g. static files)
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
}; 