"use client";

import React from "react";
import Link from "next/link";
import { User, Lock, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const AuthGuard: React.FC<{
  children: React.ReactNode;
  title?: string;
  description?: string;
}> = ({
  children,
  title = "Authentication Required",
  description = "Please sign in to your account to view your order history, delivery tracking, and saved addresses.",
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-stone-500 font-medium">
          Verifying your account session...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 text-center px-4">
        <div className="bg-white rounded-3xl border border-amber-200/90 p-8 shadow-xl shadow-amber-900/5 space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[10px] tracking-widest font-bold text-amber-700 uppercase">
              Customer Account
            </span>
            <h2 className="font-serif text-2xl font-bold text-stone-900 mt-1">
              {title}
            </h2>
            <p className="text-xs text-stone-500 mt-2 leading-relaxed">
              {description}
            </p>
          </div>
          <div className="flex flex-col gap-2.5 pt-2">
            <Link
              href="/auth/login"
              className="w-full py-3 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <span>Sign In to Account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/auth/register"
              className="w-full py-2.5 rounded-full border border-amber-200 hover:bg-amber-50 text-stone-700 text-xs font-semibold transition-colors"
            >
              Create New Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
