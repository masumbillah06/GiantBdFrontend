"use client";

import Image from "next/image";
import { useState } from "react";

export interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
}

export function ForgotPasswordForm({ onBackToLogin }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="w-full max-w-sm px-8">
      {/* Logo */}
      <div className="mb-8 flex justify-center">
        <Image
          src="/giantbdLogo.webp"
          alt="Giant BD Co Limited"
          width={170}
          height={64}
          className="h-22 w-auto object-contain"
        />
      </div>

      <div className="space-y-2 text-center">
        <h2 className="text-xl font-bold text-slate-900">Forgot Password?</h2>
        <p className="mt-2 text-sm text-slate-500">
          {sent
            ? "A verification code has been sent to your email."
            : "Enter your registered email address and we'll send you a verification code."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {!sent && (
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-[#476ab8] focus:ring-1 focus:ring-[#476ab8]"
          />
        )}

        {!sent ? (
          <button
            type="submit"
            className="w-full rounded-lg bg-[#476ab8] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#3a5aa0] cursor-pointer"
          >
            Send OTP
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setSent(false)}
            className="w-full rounded-lg bg-emerald-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 cursor-pointer"
          >
            Resend Code
          </button>
        )}

        <button
          type="button"
          onClick={onBackToLogin}
          className="w-full text-sm text-slate-500 hover:text-slate-900 cursor-pointer"
        >
          Back to Login
        </button>
      </form>
    </div>
  );
}

export default ForgotPasswordForm;

