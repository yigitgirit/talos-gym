import type {Metadata} from "next";
import {Geist, Geist_Mono, Inter, Oxanium} from "next/font/google";
import "./globals.css";
import {cn} from "@/lib/utils";
import {ThemeProvider} from "@/components/providers/theme-provider"
import {AuthProvider} from "@/components/providers/auth-provider"
import {TooltipProvider} from "@/components/ui/tooltip"
import {Toaster} from "@/components/ui/sonner"
import React from "react";
import {initializeSessionAsync} from "@/features/auth/actions";

const oxaniumHeading = Oxanium({subsets: ['latin'], variable: '--font-heading'});
const inter = Inter({subsets: ['latin'], variable: '--font-sans'});
const geistSans = Geist({subsets: ["latin"], variable: "--font-geist-sans"});
const geistMono = Geist_Mono({subsets: ["latin"], variable: "--font-geist-mono"});

export const metadata: Metadata = {
    title: {
        default: "TalosGym",
        template: "%s | TalosGym",
    },
    description: "Your fit app",
};

export default async function RootLayout({
                                             children,
                                         }: Readonly<{
    children: React.ReactNode;
}>) {

    const sessionResult = await initializeSessionAsync();
    const initialUser = sessionResult.success ? (sessionResult.data ?? null) : null;

    return (
        <html
            lang="en"
            className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, inter.variable, oxaniumHeading.variable)}
            suppressHydrationWarning
        >
        <body className="min-h-full flex flex-col">
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <AuthProvider initialUser={initialUser}>
                <TooltipProvider>
                    {children}
                </TooltipProvider>
                <Toaster/>
            </AuthProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}
