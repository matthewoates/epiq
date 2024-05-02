import { initTRPC } from '@trpc/server';
import type { CreateWSSContextFnOptions } from '@trpc/server/adapters/ws';
import { z } from 'zod';
import type { Role } from '../server';

const t = initTRPC.context<TRPCContext>().create();

const userImages = new Map<string, string>();

export const createContext = (opts: CreateWSSContextFnOptions) => {
  const search = opts.req.url?.split('?')[1] ?? '';
  const params: Record<string, string> = {};

  search.split('&')
    .forEach(keyValStr => {
      const [key, val] = keyValStr.split('=').map(decodeURIComponent);
      params[key] = val;
    });

  const name = params.name ?? 'NONAME';
  const role: Role = (params.role as Role) ?? 'draw';
  return { name, role };
}

export type TRPCContext = ReturnType<typeof createContext>;

// runs on the server
// inferred type used in client
export const rpcRouter = t.router({
  setImg: t.procedure
    .input(
      z.object({
        name: z.string().optional(),
        img: z.string()
      })
    )
    .mutation((req) => {
      const { input, ctx } = req;
      const kb = Math.floor(input.img.length / 1000);
      const reqName = ctx.name;
      const targetName = input.name ?? ctx.name;

      console.log(`${reqName} (${ctx.role}) sent img for ${targetName} - ${kb}KB`);
      userImages.set(targetName, input.img);
    })
});

export type RPCRouter = typeof rpcRouter;