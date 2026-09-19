"use client";

import { useMutation } from "@tanstack/react-query";
import { login, logout, verifyOtp, resendOtp } from "../services/auth.service";
import type { LoginRequest, LoginResponse, VerifyOtpRequest } from "../types/auth.types";

export function useLogin() {
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: login,
  });
}

export function useVerifyOtp() {
  return useMutation<LoginResponse, Error, VerifyOtpRequest>({
    mutationFn: verifyOtp,
  });
}

export function useResendOtp() {
  return useMutation<{ message: string }, Error, string>({
    mutationFn: resendOtp,
  });
}

export function useLogout() {
  return useMutation<void, Error, void>({
    mutationFn: logout,
  });
}

