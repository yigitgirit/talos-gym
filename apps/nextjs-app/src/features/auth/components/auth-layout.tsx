"use client"

import React from "react"
import Link from "next/link"
import { Logo } from "@/components/layout/logo";

interface AuthLayoutProps {
  readonly children: React.ReactNode
  readonly title: string
  readonly description?: string
}

const quotes = [
  {
    text: "Your body can stand almost anything. It's your mind that you need to convince.",
    author: "Arnold Schwarzenegger",
  },
  {
    text: "The only bad workout is the one that didn't happen.",
    author: "Unknown",
  },
  {
    text: "Fitness is not about being better than someone else. It's about being better than you used to be.",
    author: "Khloe Kardashian",
  },
  {
    text: "Take care of your body. It's the only place you have to live.",
    author: "Jim Rohn",
  },
]

export function AuthLayout({
  children,
  title,
  description,
}: AuthLayoutProps) {
  const quoteIndex = (title.length + (description?.length ?? 0)) % quotes.length
  const randomQuote = quotes[quoteIndex]

  return (
    <div className="w-full min-h-dvh lg:h-dvh flex">
      {/* Left Section - Form */}
      <div className="w-full lg:w-4/7 flex flex-col bg-white">
        {/* Logo */}
        <div className="shrink-0 p-6 lg:p-8">
          <Logo />
        </div>

        {/* Form Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-3 lg:px-6 py-3 lg:py-6 overflow-y-auto">
          <div className="w-full max-w-md flex flex-col my-auto">
            {/* Header */}
            <div className="mb-3">
              <h1 className="font-heading text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                {title}
              </h1>
              {description && (
                <p className="text-sm text-gray-600">
                  {description}
                </p>
              )}
            </div>

            {/* Form */}
            <div>
              {children}
            </div>

            {/* Footer Links */}
            <div className="mt-2 text-center text-xs text-gray-600">
              <p>
                By continuing, you agree to our{" "}
                <Link href="/terms" className="text-blue-600 hover:text-blue-700 hover:underline font-medium">
                  Terms
                </Link>
                {" "}and{" "}
                <Link href="/privacy" className="text-blue-600 hover:text-blue-700 hover:underline font-medium">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Image & Quote */}
      <div className="hidden lg:flex w-3/7 bg-linear-to-br from-blue-600 to-blue-800 relative overflow-hidden flex-col items-center justify-center p-6 xl:p-8">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-md text-center">
          {/* Image */}
          <div className="mb-4">
            <div className="w-56 h-56 xl:w-64 xl:h-64 mx-auto bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 flex items-center justify-center overflow-hidden">
              <div className="w-full h-full relative bg-linear-to-br from-white/5 to-white/10 flex items-center justify-center">
                <svg
                  className="w-32 h-32 text-white/40"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Quote */}
          <div className="space-y-4">
              <blockquote className="text-lg sm:text-xl xl:text-2xl font-semibold text-white leading-tight">
              &ldquo;{randomQuote.text}&rdquo;
            </blockquote>
            <p className="text-blue-100 font-medium">
              {randomQuote.author}
            </p>
          </div>

          {/* Bottom accent */}
          <div className="mt-6 flex justify-center gap-1">
            <div className="w-2 h-2 rounded-full bg-white/40" />
            <div className="w-2 h-2 rounded-full bg-white/60" />
            <div className="w-2 h-2 rounded-full bg-white/40" />
          </div>
        </div>
      </div>
    </div>
  )
}
