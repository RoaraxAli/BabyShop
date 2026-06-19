"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (adminOnly && user.role !== "admin") {
        router.push("/shop");
      }
    }
  }, [user, loading, router, adminOnly]);

  if (loading || !user) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (adminOnly && user.role !== "admin") {
    return null; // Will redirect
  }

  return <>{children}</>;
}
