"use client";

import { useState } from "react";
import { LoginForm } from "@/features/auth/components/login-form";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";

export default function LoginPage() {
  const [forgotPassword, setForgotPassword] = useState(false);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <div className="relative h-135 w-225 overflow-hidden rounded-4xl bg-white shadow-xl">
        {/* Welcome Panel with sliding animation */}
        <div
          className={`
            absolute left-0 top-0 z-20
            flex h-full w-1/2
            items-center justify-center
            bg-[#476ab8]
            transition-transform duration-700 ease-in-out
            ${forgotPassword ? "translate-x-full" : "translate-x-0"}
          `}
          style={{
            borderRadius: forgotPassword
              ? "30% 0 0 30% / 30% 0 0 30%"
              : "0 30% 30% 0 / 0 30% 30% 0",
          }}
        >
          <div className="text-center text-white px-10">
            <h1 className="text-4xl font-bold leading-snug">
              <div>
                <span>Welcome to</span> <br />
                <span>Giant BD ERP</span>
              </div>
            </h1>
          </div>
        </div>

        {/* Login Panel */}
        <div
          className={`
            absolute right-0 top-0 z-10
            flex h-full w-1/2
            items-center justify-center
            bg-white
            transition-all duration-700 ease-in-out
            ${forgotPassword ? "opacity-0 pointer-events-none" : "opacity-100"}
          `}
        >
          <LoginForm onForgotPassword={() => setForgotPassword(true)} />
        </div>

        {/* Forgot Password Panel */}
        <div
          className={`
            absolute left-0 top-0 z-10
            flex h-full w-1/2
            items-center justify-center
            bg-white
            transition-all duration-700 ease-in-out
            ${forgotPassword ? "opacity-100" : "opacity-0 pointer-events-none"}
          `}
        >
          <ForgotPasswordForm onBackToLogin={() => setForgotPassword(false)} />
        </div>
      </div>
    </main>
  );
}
