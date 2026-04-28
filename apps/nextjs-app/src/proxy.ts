import type {NextRequest} from "next/server"
import {NextResponse} from "next/server"
import {jwtVerify} from "jose"
import {AUTH_COOKIES} from "@/config/auth.config"
import type {JwtPayload} from "@/lib/api/schema/jwt"
import {isValidJwtPayload, extractRolesFromPayload, isTokenExpired} from "@/lib/api/schema/jwt"

const protectedRoutes = [
  {
    path: "/dashboard",
    roles: ["ADMIN", "TRAINER", "MEMBER"],
  },
  {
    path: "/loans",
    roles: ["ADMIN", "TRAINER", "MEMBER"],
  },
]

const authRoutes = new Set(["/auth/login", "/auth/register"])

function redirectToLogin(request: NextRequest, pathname: string) {
  const url = new URL("/auth/login", request.url)
  url.searchParams.set("callbackUrl", pathname)
  return NextResponse.redirect(url)
}

async function verifyUserToken(token: string): Promise<JwtPayload | null> {
  const secretKey = process.env.JWT_SECRET_KEY
  if (!secretKey) {
    console.error("JWT_SECRET_KEY is not defined in environment variables")
    return null
  }
  try {
    // Buffer for proper base64 decoding (Node.js API)
    const secret = new Uint8Array(Buffer.from(secretKey, 'base64'))
    const { payload } = await jwtVerify(token, secret)

    if (!isValidJwtPayload(payload)) {
      console.error("Token payload does not match expected JWT structure")
      return null
    }

    // Check if token is expired
    if (isTokenExpired(payload)) {
      console.warn("Token is expired")
      return null
    }

    return payload
  } catch (error) {
    console.error("Token verification failed:", error)
    return null
  }
}

function checkRoleAccess(payload: JwtPayload | null, allowedRoles: string[]): boolean {
  if (!payload) {
    return false
  }

  const userRoles = extractRolesFromPayload(payload)
  return allowedRoles.some((role) => userRoles.includes(role))
}

export async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get(AUTH_COOKIES.ACCESS_TOKEN)?.value
  const refreshToken = request.cookies.get(AUTH_COOKIES.REFRESH_TOKEN)?.value
  const {pathname} = request.nextUrl

  if (authRoutes.has(pathname)) {
    if (accessToken) {
      return NextResponse.redirect(new URL("/", request.url))
    }
    return NextResponse.next()
  }

  const protectedRoute = protectedRoutes.find((route) =>
    pathname.startsWith(route.path)
  )

  // Allow non-protected routes to proceed immediately
  if (!protectedRoute) {
    return NextResponse.next()
  }

  let payload = null
  if (accessToken) {
    payload = await verifyUserToken(accessToken)
  }

  // Unauthenticated
  if (!payload) {
    if (refreshToken) return NextResponse.next()
    return redirectToLogin(request, pathname)
  }

  // Check roles authorization
  if (!checkRoleAccess(payload, protectedRoute.roles)) {
    if (pathname.startsWith("/dashboard/") && pathname !== "/dashboard") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|avatars).*)",
  ],
}
