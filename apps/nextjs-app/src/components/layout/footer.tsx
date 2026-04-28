"use client";

import Link from "next/link";
import { Logo } from "./logo";

export const Footer = () => (
  <footer className="w-full bg-muted/50 border-t border-border">
    <div className="container max-w-7xl mx-auto px-4 py-12">
      <div className="grid md:grid-cols-4 gap-8 mb-8">
        <div>
          <div className="mb-4">
            <Logo />
          </div>
          <p className="text-sm text-muted-foreground">Transform your fitness journey with TalosGym.</p>
        </div>
        <div>
          <h4 className="font-heading font-bold mb-4 text-sm">Product</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/clubs" className="hover:text-foreground transition-colors">Clubs</Link></li>
            <li><Link href="/membership-plans" className="hover:text-foreground transition-colors">Plans</Link></li>
            <li><Link href="#" className="hover:text-foreground transition-colors">Security</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-heading font-bold mb-4 text-sm">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
            <li><Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
            <li><Link href="#" className="hover:text-foreground transition-colors">Careers</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-heading font-bold mb-4 text-sm">Legal</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link></li>
            <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link></li>
            <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border pt-8">
        <p className="text-center text-sm text-muted-foreground">
          © 2026 TalosGym. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);
