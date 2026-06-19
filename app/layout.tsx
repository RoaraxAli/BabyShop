import type { Metadata } from "next";
import { AuthProvider } from "@/components/AuthProvider";
import "fumadocs-ui/style.css";
import "./globals.css";
export const metadata: Metadata = {
  title: "BabyShop | Baby essentials and parent support",
  description:
    "A polished Next.js website for BabyShopHub with product discovery, support content, and complete documentation.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
