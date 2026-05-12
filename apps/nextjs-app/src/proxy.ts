import type {NextRequest} from "next/server"
import {NextResponse} from "next/server"
import {jwtVerify} from "jose"
import {AUTH_COOKIES} from "@/config/auth.config"
import type {JwtPayload} from "@/lib/api/schema/jwt"
import {isTokenExpired, isValidJwtPayload} from "@/lib/api/schema/jwt"

const protectedRoutes = [
    {
        path: "/dashboard",
        roles: ["ROLE_ADMIN", "ROLE_TRAINER"],
    },
    {
        path: "/account",
        roles: ["ROLE_MEMBER", "ROLE_ADMIN", "ROLE_TRAINER"],
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
        console.error("JWT_SECRET_KEY is not defined")
        return null
    }
    try {
        // Standard Base64 decoding for Edge Runtime
        const binaryString = atob(secretKey);
        const secret = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            secret[i] = binaryString.charCodeAt(i);
        }

        const { payload } = await jwtVerify(token, secret);

        if (!isValidJwtPayload(payload)) return null
        if (isTokenExpired(payload)) return null

        return payload
    } catch (error) {
        console.error("Token verification failed:", error)
        return null
    }
}

function checkRoleAccess(payload: JwtPayload | null, allowedRoles: string[]): boolean {
    if (!payload) return false;

    const userRoles: string[] = payload.roles || [];

    // Simple, direct comparison
    return allowedRoles.some((role) => userRoles.includes(role));
}

export async function proxy(request: NextRequest) {
    const accessToken = request.cookies.get(AUTH_COOKIES.ACCESS_TOKEN)?.value
    const {pathname} = request.nextUrl

    console.log(`\x1b[35m[Middleware] Gatekeeper check:\x1b[0m ${pathname}`);

    // 1. Identify if the current path is protected
    const protectedRoute = protectedRoutes.find((route) =>
        pathname.startsWith(route.path)
    );

    // 2. Handle Auth Routes (Login/Register)
    if (authRoutes.has(pathname)) {
        if (accessToken) {
            console.log(`\x1b[33m[Middleware] Already authed, redirecting away from login\x1b[0m`);
            return NextResponse.redirect(new URL("/", request.url));
        }
        return NextResponse.next();
    }

    // 3. Allow non-protected routes to proceed immediately
    if (!protectedRoute) {
        return NextResponse.next();
    }

    console.log(`\x1b[34m[Middleware] Protected route detected. Checking credentials...\x1b[0m`);

    // 4. Authenticate the user for protected routes
    let payload = null;
    if (accessToken) {
        console.log(`\x1b[36m[Middleware] Verifying Access Token...\x1b[0m`);
        payload = await verifyUserToken(accessToken);
    } else {
        console.log(`\x1b[31m[Middleware] No Access Token found in cookies\x1b[0m`);
    }

    // 5. If payload is null (expired/invalid/mismatched secret)
    if (!payload) {
        console.log(`\x1b[31m[Middleware] Authentication failed (Invalid or Expired Token). Redirecting to login.\x1b[0m`);
        return redirectToLogin(request, pathname);
    }

    // 6. Check roles authorization (ADMIN or TRAINER)
    console.log(`\x1b[36m[Middleware] User roles found:\x1b[0m`, payload.roles || payload.authorities); // Check common keys

    if (!checkRoleAccess(payload, protectedRoute.roles)) {
        console.log(`\x1b[31m[Middleware] Authorization Denied. Required: ${protectedRoute.roles}, but user lacked permission.\x1b[0m`);
        return NextResponse.redirect(new URL("/", request.url));
    }

    console.log(`\x1b[32m[Middleware] Access Granted to ${pathname}\x1b[0m`);
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|avatars).*)",
    ],
}
