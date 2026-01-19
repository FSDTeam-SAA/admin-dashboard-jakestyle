"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useVerifyResetCode, useForgotPassword } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function OTPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [localError, setLocalError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    mutate: verifyOtp,
    isPending: verifyingOtp,
    error: verifyError,
  } = useVerifyResetCode();
  
  const { mutate: resendOtp, isPending: resendingOtp } = useForgotPassword();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    if (value !== "" && !/^\d+$/.test(value)) return;
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const otpString = otp.join("");

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (otpString.length !== 6) {
      setLocalError("Please enter all 6 digits");
      return;
    }

    verifyOtp(
      { email, resetCode: otpString },
      {
        onSuccess: () => {
          toast.success("OTP verified successfully");
          localStorage.setItem("resetCode", otpString);
          router.push(
            `/auth/reset-password?email=${encodeURIComponent(email)}&code=${otpString}`,
          );
        },
        onError: (err: any) => {
          const message =
            err?.response?.data?.message ||
            err?.message ||
            "Invalid OTP. Please try again.";
          setLocalError(message);
          toast.error(message);
        },
      },
    );
  };

  const handleResendOtp = () => {
    resendOtp(email, {
      onSuccess: () => {
        toast.success("OTP resent to your email");
        setResendTimer(60);
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      },
      onError: () => {
        toast.error("Failed to resend OTP");
      },
    });
  };

  const displayError =
    localError || (verifyError as any)?.response?.data?.message;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <Link
              href="/auth/forgot-password"
              className="inline-flex items-center gap-2 text-[#308FAD] font-medium mb-6 hover:translate-x-[-4px] transition-transform"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify OTP</h1>
            <p className="text-gray-500 text-sm leading-relaxed">
              We&apos;ve sent a 6-digit code to <br />
              <span className="font-semibold text-gray-900">{email}</span>
            </p>
          </div>

          <form onSubmit={handleVerifyOtp} className="space-y-8">
            {displayError && (
              <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-600">{displayError}</p>
              </div>
            )}

            <div className="space-y-4">
              <label className="block text-center text-sm font-medium text-gray-700">
                Enter your 6-digit verification code
              </label>
              <div className="flex justify-between gap-2">
                {otp.map((value, index) => (
                  <Input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={value}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 text-center text-xl font-bold border-gray-200 focus-visible:ring-[#308FAD] focus-visible:border-[#308FAD]"
                    disabled={verifyingOtp}
                    autoComplete="one-time-code"
                  />
                ))}
              </div>
            </div>

            <div className="text-center text-sm text-gray-500">
              Didn&apos;t Receive OTP?{" "}
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendingOtp || resendTimer > 0}
                className="text-[#308FAD] font-bold disabled:text-gray-300 transition-colors uppercase"
              >
                {resendTimer > 0
                  ? `Resend in ${resendTimer}s`
                  : "Resend Code"}
              </button>
            </div>

            <Button
              type="submit"
              disabled={verifyingOtp}
              className="w-full bg-[#308FAD] hover:bg-[#26738c] text-white py-2.5 h-12 rounded-lg font-bold transition-all shadow-md active:scale-[0.98]"
            >
              {verifyingOtp ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Code"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}