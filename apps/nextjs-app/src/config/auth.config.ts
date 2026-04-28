export const AUTH_COOKIES = {
    ACCESS_TOKEN: "accessToken",
    REFRESH_TOKEN: "refreshToken",
} as const;

export const COOKIE_OPTIONS = {
    accessTokenMaxAge: 15 * 60, // 15 minutes
    refreshTokenMaxAge: 7 * 24 * 60 * 60, // 7 days
} as const;