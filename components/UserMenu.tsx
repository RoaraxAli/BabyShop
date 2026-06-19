"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { LogOut, User, Settings, ShieldCheck, Heart, ShoppingBag, MapPin, ShieldAlert, LifeBuoy, Palette } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

export function UserMenu() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={ref}>
      <button 
        className="flex items-center gap-2 border border-border bg-muted/50 px-3 py-1.5 rounded-full cursor-pointer hover:bg-muted transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[var(--rose-dark)] text-white font-bold text-xs">
          {user.displayName.slice(0, 1).toUpperCase()}
        </div>
        <div className="font-medium text-sm text-[var(--ink)]">{user.displayName}</div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-background border border-border rounded-lg shadow-lg z-50 overflow-hidden flex flex-col py-1">
          <div className="px-4 py-2 border-b border-border/50">
            <p className="text-sm font-semibold truncate">{user.displayName}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
          
          <Link href="/orders" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted" onClick={() => setIsOpen(false)}>
            <ShoppingBag size={16} /> My Orders
          </Link>
          <Link href="/wishlist" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted" onClick={() => setIsOpen(false)}>
            <Heart size={16} /> My Wishlist
          </Link>
          <Link href="/profile/addresses" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted" onClick={() => setIsOpen(false)}>
            <MapPin size={16} /> Saved Addresses
          </Link>
          
          <div className="h-px bg-border/50 my-1"></div>
          
          <Link href="/profile/theme" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted" onClick={() => setIsOpen(false)}>
            <Palette size={16} /> App Theme Customizer
          </Link>
          <Link href="/profile/2fa" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted" onClick={() => setIsOpen(false)}>
            <ShieldCheck size={16} /> 2FA Security
          </Link>
          <Link href="/contact" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted" onClick={() => setIsOpen(false)}>
            <LifeBuoy size={16} /> Contact Support
          </Link>

          {user.role === "admin" && (
            <>
              <div className="h-px bg-border/50 my-1"></div>
              <Link href="/admin" className="flex items-center gap-2 px-4 py-2 text-sm text-rose-500 hover:bg-rose-500/10 font-medium" onClick={() => setIsOpen(false)}>
                <ShieldAlert size={16} /> Return to Admin Panel
              </Link>
            </>
          )}
          
          <div className="h-px bg-border/50 my-1"></div>
          
          <button 
            className="flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-muted cursor-pointer text-muted-foreground w-full bg-transparent border-none"
            onClick={() => {
              setIsOpen(false);
              logout();
            }}
          >
            <LogOut size={16} /> Log Out
          </button>
        </div>
      )}
    </div>
  );
}
