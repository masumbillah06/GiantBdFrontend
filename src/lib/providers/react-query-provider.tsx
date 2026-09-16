"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

/**
 * React Query client provider.
 * Must be a Client Component because QueryClient must not be shared across requests.
 *
 * Default configuration:
 * - staleTime: 60s  — data is considered fresh for 60 seconds before a background refetch
 * - gcTime:    5min — unused cache entries are garbage-collected after 5 minutes
 * - retry:     1    — retry failed requests once before marking as error
 */
export function ReactQueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,        // 60 seconds
            gcTime: 5 * 60 * 1000,       // 5 minutes
            retry: 1,
            refetchOnWindowFocus: false,  // disable for ERP dashboard (user preference)
          },
          mutations: {
            retry: 0,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

