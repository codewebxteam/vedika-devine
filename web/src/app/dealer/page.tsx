"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function DealerIndexPage() {
  const router = useRouter();
  const { isDealer, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (isDealer) {
        router.replace("/dealer/dashboard");
      } else {
        router.replace("/dealer/login");
      }
    }
  }, [isDealer, loading, router]);

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
