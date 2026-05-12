import React from "react"
import {AccountSidebarNav} from "@/components/layout/account-sidebar-nav";
import {Settings} from "lucide-react";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-muted/10 pb-12">
      <div className="container max-w-6xl mx-auto px-4 pt-8 md:pt-12">
        <div className="mb-8 flex items-start gap-4">
          <div className="mt-1 bg-primary/10 p-2 rounded-lg">
            <Settings className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold tracking-tight">Account Settings</h1>
            <p className="mt-1 text-md text-muted-foreground">
              Manage your profile, security, and preferences.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Navigation Sidebar */}
          <aside className="w-full md:w-64 shrink-0">
            <AccountSidebarNav />
          </aside>

          {/* Right Content Area */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}