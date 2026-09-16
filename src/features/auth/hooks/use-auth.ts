"use client";

import { useMutation } from "@tanstack/react-query";
import { login, logout } from "../services/auth.service";
import type { LoginRequest, LoginResponse } from "../types/auth.types";

export function useLogin() {
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: login,
  });
}

export function useLogout() {
  return useMutation<void, Error, void>({
    mutationFn: logout,
  });
}

