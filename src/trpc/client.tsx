"use client";

// ^-- to make sure we can mount the Provider from a server component
import { useState } from "react";
import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import superjson from "superjson";

import { makeQueryClient } from "./query-client";
import type { AppRouter } from "./routers/_app";

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();

let browserQueryClient: QueryClient;

/**
 * Provide a React Query QueryClient appropriate for the current runtime environment.
 *
 * On the server this always creates and returns a fresh QueryClient. In the browser it returns a singleton QueryClient that is created once and reused for subsequent calls.
 *
 * @returns A configured QueryClient instance; a new instance on the server, or the cached singleton instance in the browser.
 */
function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return makeQueryClient();
  }
  // Browser: make a new query client if we don't already have one
  // This is very important, so we don't re-make a new client if React
  // suspends during the initial render. This may not be needed if we
  // have a suspense boundary BELOW the creation of the query client
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

/**
 * Compute the full TRPC API URL based on runtime environment.
 *
 * In the browser this yields the relative path `/api/trpc`. On the server it
 * returns `https://<VERCEL_URL>/api/trpc` when `VERCEL_URL` is set, otherwise
 * `http://localhost:3000/api/trpc`.
 *
 * @returns The TRPC API URL (e.g. `/api/trpc` in-browser or `https://<VERCEL_URL>/api/trpc` on server).
 */
function getUrl() {
  const base = (() => {
    if (typeof window !== "undefined") return "";
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    return "http://localhost:3000";
  })();
  return `${base}/api/trpc`;
}

/**
 * Provides application-wide TRPC and React Query contexts to its children.
 *
 * Wraps the given children with a QueryClientProvider and a TRPCProvider configured
 * with a stable TRPC client and an environment-aware QueryClient.
 *
 * @param props.children - The React nodes to render inside the providers
 * @returns A React element that wraps `children` with TRPC and Query providers
 */
export function TRPCReactProvider(
  props: Readonly<{
    children: React.ReactNode;
  }>,
) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          transformer: superjson, // <-- if you use a data transformer
          url: getUrl(),
        }),
      ],
    }),
  );
  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {props.children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}
