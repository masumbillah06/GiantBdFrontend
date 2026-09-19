"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { AlertCircle, CheckCircle2, Eye, EyeOff, KeyRound, Loader2, ArrowLeft } from "lucide-react";
import { useLogin, useVerifyOtp, useResendOtp } from "../hooks/use-auth";
import { useAuthStore } from "@/store/auth.store";

export interface LoginFormProps {
  onForgotPassword: () => void;
}

export function LoginForm({ onForgotPassword }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  // 2FA state
  const [twoFactorData, setTwoFactorData] = useState<{
    tempToken: string;
    email?: string;
  } | null>(null);
  const [otp, setOtp] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const loginMutation = useLogin();
  const verifyOtpMutation = useVerifyOtp();
  const resendOtpMutation = useResendOtp();
  const setAuth = useAuthStore((s) => s.setAuth);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);

    loginMutation.mutate(
      { email: email.trim(), password },
      {
        onSuccess: (res) => {
          if (res.require2FA && res.tempToken) {
            setTwoFactorData({
              tempToken: res.tempToken,
              email: res.email || email.trim(),
            });
            setInfoMessage(res.message || "A 6-digit verification code has been sent to your email.");
          } else if (res.user && res.accessToken) {
            setAuth(res.user, res.accessToken);
            const from = searchParams.get("from") || "/inventory/dashboard";
            router.push(from);
          } else {
            setErrorMessage("Unexpected login response from server");
          }
        },
        onError: (err: any) => {
          const resData = err?.response?.data;
          let msg = "Invalid login credentials. Please try again.";
          if (resData?.message) {
            if (Array.isArray(resData.message)) {
              msg = resData.message.join(", ");
            } else if (typeof resData.message === "string") {
              msg = resData.message;
            }
          } else if (err?.message) {
            msg = err.message;
          }
          setErrorMessage(msg);
        },
      }
    );
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!twoFactorData?.tempToken || !otp.trim()) return;

    setErrorMessage(null);
    setInfoMessage(null);

    verifyOtpMutation.mutate(
      { tempToken: twoFactorData.tempToken, otp: otp.trim() },
      {
        onSuccess: (res) => {
          if (res.user && res.accessToken) {
            setAuth(res.user, res.accessToken);
            const from = searchParams.get("from") || "/inventory/dashboard";
            router.push(from);
          } else {
            setErrorMessage("Verification succeeded but no session token received.");
          }
        },
        onError: (err: any) => {
          const resData = err?.response?.data;
          let msg = "Invalid verification code. Please try again.";
          if (resData?.message) {
            if (Array.isArray(resData.message)) {
              msg = resData.message.join(", ");
            } else if (typeof resData.message === "string") {
              msg = resData.message;
            }
          } else if (err?.message) {
            msg = err.message;
          }
          setErrorMessage(msg);
        },
      }
    );
  };

  const handleResendOtp = () => {
    setErrorMessage(null);
    setInfoMessage(null);
    resendOtpMutation.mutate(email.trim(), {
      onSuccess: (res) => {
        setInfoMessage(res.message || "A new verification code has been sent.");
      },
      onError: (err: any) => {
        const msg = err?.response?.data?.message || err?.message || "Failed to resend code.";
        setErrorMessage(Array.isArray(msg) ? msg.join(", ") : msg);
      },
    });
  };

  return (
    <div className="w-full max-w-sm px-8">
      {/* Logo */}
      <div className="mb-6 flex justify-center">
        <Image
          src="/image.png"
          alt="Giant BD Co Limited"
          width={170}
          height={64}
          priority
          className="h-24 w-auto object-contain"
        />
      </div>

      {errorMessage && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {infoMessage && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700">
          <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{infoMessage}</span>
        </div>
      )}

      {twoFactorData ? (
        /* ── 2FA OTP Verification Form ── */
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="text-center space-y-1">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-[#476ab8]">
              <KeyRound className="h-5 w-5" />
            </div>
            <h2 className="text-base font-semibold text-slate-800">Two-Factor Authentication</h2>
            <p className="text-xs text-slate-500">
              Enter the 6-digit code sent to{" "}
              <span className="font-medium text-slate-700">{twoFactorData.email}</span>
            </p>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Verification Code</label>
            <input
              type="text"
              required
              maxLength={6}
              autoFocus
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="123456"
              className="w-full text-center tracking-[0.5em] font-mono font-bold text-lg rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-800 placeholder-slate-300 outline-none focus:border-[#476ab8] focus:ring-1 focus:ring-[#476ab8]"
            />
          </div>

          <button
            type="submit"
            disabled={verifyOtpMutation.isPending || otp.length < 6}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#476ab8] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#3a5aa0] cursor-pointer disabled:opacity-60"
          >
            {verifyOtpMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {verifyOtpMutation.isPending ? "Verifying..." : "Verify & Continue"}
          </button>

          <div className="flex items-center justify-between pt-1 text-xs">
            <button
              type="button"
              onClick={() => {
                setTwoFactorData(null);
                setOtp("");
                setErrorMessage(null);
                setInfoMessage(null);
              }}
              className="flex items-center gap-1 text-slate-500 hover:text-slate-700 cursor-pointer"
            >
              <ArrowLeft size={14} />
              Back to Login
            </button>

            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendOtpMutation.isPending}
              className="text-[#476ab8] hover:underline cursor-pointer disabled:opacity-60 font-medium"
            >
              {resendOtpMutation.isPending ? "Sending..." : "Resend Code"}
            </button>
          </div>
        </form>
      ) : (
        /* ── Regular Email / Password Login Form ── */
        <form onSubmit={handleLogin} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Your Email"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-[#476ab8] focus:ring-1 focus:ring-[#476ab8]"
            />
          </div>

          <div className="relative">
            <label className="mb-1 block text-xs font-medium text-slate-600">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 pr-11 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-[#476ab8] focus:ring-1 focus:ring-[#476ab8]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-8 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-xs text-[#476ab8] hover:underline cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full mt-2 flex items-center justify-center gap-2 rounded-lg bg-[#476ab8] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#3a5aa0] cursor-pointer disabled:opacity-60"
          >
            {loginMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </button>
        </form>
      )}
    </div>
  );
}

export default LoginForm;
