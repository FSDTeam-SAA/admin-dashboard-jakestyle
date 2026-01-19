"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, ArrowLeft, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useForgotPassword } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [localError, setLocalError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  
  // Using isPending directly from the hook is preferred over manual loading state
  const { mutate: forgotPassword, isPending, error } = useForgotPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (!email) {
      setLocalError("Please enter your email address");
      return;
    }

    forgotPassword(email, {
      onSuccess: () => {
        setSubmitted(true);
        toast.success("OTP sent to your email");
        localStorage.setItem("resetEmail", email);
        setTimeout(() => {
          router.push(`/auth/verify-otp?email=${encodeURIComponent(email)}`);
        }, 2000);
      },
      onError: (err: any) => {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to send OTP. Please try again.";
        setLocalError(message);
        toast.error(message);
      },
    });
  };

  const displayError = localError || (error as any)?.response?.data?.message;

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-[#D1F3FF] rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-[#308FAD]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Check Your Email
            </h2>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              We've sent a password reset code to <br />
              <span className="font-semibold text-gray-900">{email}</span>
            </p>
            <div className="flex items-center justify-center gap-2 text-gray-400 text-xs">
              <Loader2 className="w-3 h-3 animate-spin" />
              Redirecting to verification page...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 text-[#308FAD] font-medium mb-6 hover:translate-x-[-4px] transition-transform"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Forgot Password
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed">
              Enter your registered email address. We'll send you a code to
              reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                <Input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 border-gray-200 focus-visible:ring-[#308FAD] focus-visible:border-[#308FAD]"
                  disabled={isPending}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#308FAD] hover:bg-[#26738c] text-white py-2.5 rounded-lg font-medium transition-colors"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending Code...
                </>
              ) : (
                "Send OTP"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}