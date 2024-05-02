import { createTRPCProxyClient, createWSClient, wsLink } from "@trpc/client";
import { Role } from "../server";
import type { RPCRouter } from "./rpc-router";

export type RPCClient = ReturnType<typeof createTRPCProxyClient<RPCRouter>>;

const wsURL = `${window.location.protocol.replace('http', 'ws')}//${window.location.hostname}:3015/socket`;

export function createConnection(role: Role, name: string) {
  const wsClient = createWSClient({
    url: wsURL + `?role=${role}&name=${encodeURIComponent(name)}`,
    retryDelayMs: () => 1000
  });

  const client = createTRPCProxyClient<RPCRouter>({
    links: [
      wsLink({
        client: wsClient
      })
    ]
  });

  return { client, wsClient };
}