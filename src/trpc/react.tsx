'use client';

import { QueryClientProvider, type QueryClient } from '@tanstack/react-query';
import {
  createTRPCClient,
  httpBatchLink,
  httpBatchStreamLink,
  loggerLink,
  splitLink,
} from '@trpc/client';
import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { createTRPCContext } from '@trpc/tanstack-react-query';
import { useState } from 'react';
import * as SuperJSON from 'superjson';

import { authClient } from '@/lib/better-auth/client';
import { type AppRouter } from '@/server/api/root';
import { createQueryClient } from './query-client';

let clientQueryClientSingleton: QueryClient | undefined = undefined;
const getQueryClient = () => {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return createQueryClient();
  }
  // Browser: use singleton pattern to keep the same query client
  clientQueryClientSingleton ??= createQueryClient();

  return clientQueryClientSingleton;
};

const {
  TRPCProvider,
  useTRPC: useApi,
  useTRPCClient: useApiClient,
} = createTRPCContext<AppRouter>();
export { useApi, useApiClient };

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>;

export function TRPCReactProvider(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === 'development' ||
            (op.direction === 'down' && op.result instanceof Error),
        }),
        splitLink({
          condition(op) {
            return Boolean(op.context.skipStream);
          },
          true: httpBatchLink({
            transformer: SuperJSON,
            url: getBaseUrl() + '/api/trpc',
            headers: () => {
              const headers = new Headers();
              headers.set('x-trpc-source', 'expo-react');
              const cookies = authClient.getCookie();
              if (cookies) {
                headers.set('Cookie', cookies);
              }
              return headers;
            },
            fetch(url, options) {
              return fetch(url, {
                ...options,
                credentials: 'include',
              });
            },
          }),
          false: httpBatchStreamLink({
            transformer: SuperJSON,
            url: getBaseUrl() + '/api/trpc',
            headers: () => {
              const headers = new Headers();
              headers.set('x-trpc-source', 'expo-react');
              const cookies = authClient.getCookie();
              if (cookies) {
                headers.set('Cookie', cookies);
              }
              return headers;
            },
          }),
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

function getBaseUrl() {
  if (typeof window !== 'undefined') return window.location.origin;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 8081}`;
}
