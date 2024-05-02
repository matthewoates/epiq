import { applyWSSHandler } from '@trpc/server/adapters/ws';
import * as WebSocket from 'ws';
import { createContext, rpcRouter } from '../rpc/rpc-router';

const PORT = 3015;
const wss = new WebSocket.Server({ port: PORT });

export type Role = 'draw' | 'watch' | 'control';

const handler = applyWSSHandler({
  wss,
  router: rpcRouter,
  createContext
});

process.on('SIGTERM', () => {
  console.info('SIGTERM. broadcast reconnect');
  // not sure if this does anything
  handler.broadcastReconnectNotification();
  wss.close();
})

console.log(`WebSocket server started on port ${PORT}`);