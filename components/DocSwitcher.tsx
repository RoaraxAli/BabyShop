"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Book, Code, User } from "lucide-react";

export function DocSwitcher() {
  const pathname = usePathname() || "";

  const links = [
    { href: "/docs/documentation", label: "Documentation", icon: Book },
    { href: "/docs/user-guide", label: "User Guide", icon: User },
    { href: "/docs/developer-guide", label: "Developer Guide", icon: Code },
  ];

  return (
    <div className="flex flex-col gap-1 pb-2 mb-2 border-b border-border/50">
      <Link
        href="/"
        className="flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors text-muted-foreground hover:bg-muted/50 hover:text-foreground mb-2"
      >
        <span className="font-medium text-primary">← Return to Store</span>
      </Link>
      {links.map((link) => {
        const isActive = pathname.startsWith(link.href);
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
              isActive 
                ? "bg-primary/10 text-primary font-medium" 
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            }`}
          >
            <Icon size={16} />
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}
