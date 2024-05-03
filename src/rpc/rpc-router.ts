import { initTRPC } from '@trpc/server';
import type { CreateWSSContextFnOptions } from '@trpc/server/adapters/ws';
import { observable } from '@trpc/server/observable';
import EventEmitter from 'events';
import { z } from 'zod';
import logger from '../logger';
import type { Role } from '../server';

const t = initTRPC.context<TRPCContext>().create();

type UserData = {
  primaryColor: string;
  secondaryColor: string;
  img: string;
}

const userData = new Map<string, UserData>();

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
  logger.info(`${name} (${role}) connected`);
  return { name, role };
}

// TODO: infer these
type ImgEvent = { name: string, img: string };
type ColorEvent = { name: string, primaryColor: string, secondaryColor: string };

export type TRPCContext = ReturnType<typeof createContext>;

const ee = new EventEmitter();

function updateUserData(name: string, patch: Partial<UserData>) {
  const newData: UserData = {
    primaryColor: 'pink',
    secondaryColor: 'black',
    img: '',
    ...patch
  };

  userData.set(name, newData);
}

// runs on the server
// inferred type used in client
export const rpcRouter = t.router({
  watchImages: t.procedure.subscription(() => {
    return observable<ImgEvent>(emit => {
      const onNewImg = (ie: ImgEvent) => {
        emit.next(ie);
      };

      ee.on('ie', onNewImg);

      return () => ee.off('ie', onNewImg);
    });
  }),

  watchColors: t.procedure
    .input(
      z.object({
        name: z.string().optional()
      })
    ).subscription((req) => {
      return observable<ColorEvent>(emit => {
        const targetName = req.input.name ?? req.ctx.name;

        const onNewColors = (ce: ColorEvent) => {
          if (targetName === ce.name) {
            emit.next(ce);
          }
        };

        ee.on('ce', onNewColors);

        return () => ee.off('ce', onNewColors);
      });
    }),

  setColor: t.procedure
    .input(
      z.object({
        name: z.string(),
        primaryColor: z.string(),
        secondaryColor: z.string()
      })
    )
    .mutation((req) => {
      const { input } = req;
      const { name, ...colors } = input;

      updateUserData(name, colors);
      ee.emit('ce', input);
    }),

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

      logger.trace(`${reqName} (${ctx.role}) sent img for ${targetName} - ${kb}KB`);
      updateUserData(targetName, { img: input.img });

      const ie: ImgEvent = { name: targetName, img: input.img };
      ee.emit('ie', ie);
    })
});

export type RPCRouter = typeof rpcRouter;