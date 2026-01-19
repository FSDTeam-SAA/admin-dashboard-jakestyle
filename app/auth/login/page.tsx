"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Mail, Lock, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useLogin } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";

export default function LoginPage() {
  const { status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  
  const { mutate: login, isPending, error } = useLogin();

  useEffect(() => {
    if (status === "authenticated") {
      window.location.href = "/admin";
    }
  }, [status]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (!email || !password) {
      setLocalError("Please enter both email and password");
      return;
    }

    login(
      { email, password },
      {
        onSuccess: () => {
          toast.success("Login successful!");
        },
        onError: (err: any) => {
          const message =
            err?.message ||
            err.response?.data?.message ||
            "Login failed. Please try again.";
          setLocalError(message);
          toast.error(message);
        },
      }
    );
  };

  const displayError =
    localError ||
    (error as any)?.message ||
    (error as any)?.response?.data?.message;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Login To Your Account
            </h1>
            <p className="text-gray-500 text-sm">
              Please enter your email and password to continue
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {displayError && (
              <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-600">{displayError}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400 pointer-events-none transition-colors" />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 border-gray-200 focus-visible:ring-[#308FAD] focus-visible:border-[#308FAD]"
                  disabled={isPending}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400 pointer-events-none transition-colors" />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 border-gray-200 focus-visible:ring-[#308FAD] focus-visible:border-[#308FAD]"
                  disabled={isPending}
                />
              </div>
            </div>

            <div className="text-right">
              <Link
                href="/auth/forgot-password"
                className="text-sm text-[#308FAD] font-medium hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#308FAD] hover:bg-[#26738c] text-white py-2.5 rounded-lg font-medium transition-colors"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}