"use client";

import Link from "next/link";
import { Baby, BookOpen, Download, LogIn } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { UserMenu } from "@/components/UserMenu";

export function Nav() {
  const { user } = useAuth();

  return (
    <header className="site-header">
      <Link href="/" className="brand" aria-label="BabyShop home">
        <span className="brand-mark">
          <Baby size={20} />
        </span>
        <span>BabyShop</span>
      </Link>
      <nav className="nav-links" aria-label="Primary navigation">
        {user ? (
          <>
            <Link href="/shop?tab=home">Home</Link>
            <Link href="/shop?tab=shop">Shop</Link>
            <Link href="/shop?tab=cart">Cart</Link>
            <Link href="/shop?tab=wishlist">Wishlist</Link>
            <Link href="/shop?tab=assistant">AI Assistant</Link>
            <UserMenu />
          </>
        ) : (
          <>
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/downloads">
              <Download size={16} />
              Downloads
            </Link>
            <Link href="/docs/documentation">
              <BookOpen size={16} />
              Docs
            </Link>
            <Link className="nav-action" href="/login">
              <LogIn size={16} />
              Login
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
