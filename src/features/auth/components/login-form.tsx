"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { useLogin } from "../hooks/use-auth";
import { useAuthStore } from "@/store/auth.store";

export interface LoginFormProps {
  onForgotPassword: () => void;
}

export function LoginForm({ onForgotPassword }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const router = useRouter();
  const loginMutation = useLogin();
  const setAuth = useAuthStore((s) => s.setAuth);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    loginMutation.mutate(
      { email: email.trim(), password },
      {
        onSuccess: (res) => {
          if (res.user && res.accessToken) {
            setAuth(res.user, res.accessToken);
            router.push("/inventory/dashboard");
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
    </div>
  );
}

export default LoginForm;
