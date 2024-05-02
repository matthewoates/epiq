import { createTRPCProxyClient, createWSClient, wsLink } from "@trpc/client";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import DrawPad from "../components/DrawPad";
import { type RPCRouter } from '../rpc/rpc-router';
import type { Role } from "../server";

const wsURL = `${window.location.protocol.replace('http', 'ws')}//${window.location.hostname}:3015/socket`;

export function createConnection(role: Role, name: string) {
  const wsClient = createWSClient({
    url: wsURL + `role=${role}&name=${encodeURIComponent(name)}`,
    retryDelayMs: () => 1000
  });

  return createTRPCProxyClient<RPCRouter>({
    links: [
      wsLink({
        client: wsClient
      })
    ]
  });
}

function Draw() {
  const name = useSearchParams()[0].get('n') ?? 'noname';
  const ws = useMemo(() => createConnection('draw', name), [name]);

  return (
    <div>
      <h1>draw</h1>
      <DrawPad ws={ws}/>
      <p>name: {name}</p>
    </div>
  );
}

export default Draw;