"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useLogin } from "../hooks/use-auth";
import { setClientToken, setClientUser } from "@/lib/auth/session";

export interface LoginFormProps {
  onForgotPassword: () => void;
}

export function LoginForm({ onForgotPassword }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const loginMutation = useLogin();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(
      { email: email || "demo@giantbd.com", password },
      {
        onSuccess: (data) => {
          setClientToken(data.token);
          setClientUser(data.user);
          router.push("/inventory/dashboard");
        },
        onError: () => {
          // Fallback demo navigation
          router.push("/inventory/dashboard");
        },
      }
    );
  };

  return (
    <div className="w-full max-w-sm px-8">
      {/* Logo */}
      <div className="mb-10 flex justify-center">
        <Image
          src="/image.png"
          alt="Giant BD Co Limited"
          width={170}
          height={64}
          priority
          className="h-28 w-auto object-contain"
        />
      </div>

      <form onSubmit={handleLogin} className="space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter Your Email"
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-[#476ab8] focus:ring-1 focus:ring-[#476ab8]"
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 pr-11 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-[#476ab8] focus:ring-1 focus:ring-[#476ab8]"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm text-[#476ab8] hover:underline cursor-pointer"
          >
            Forgot Password?
          </button>
        </div>

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full rounded-lg bg-[#476ab8] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#3a5aa0] cursor-pointer disabled:opacity-50"
        >
          {loginMutation.isPending ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default LoginForm;

