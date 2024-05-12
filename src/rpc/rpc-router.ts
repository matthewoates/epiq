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

type WatchData = { name: string, img?: string };
let watchData: WatchData = { name: '' };

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

type ColorEvent = { name: string, primaryColor: string, secondaryColor: string };

export type TRPCContext = ReturnType<typeof createContext>;

const ee = new EventEmitter();

function getUserData(name: string) {
  const result: UserData = {
    primaryColor: '#00ff00',
    secondaryColor: '#000000',
    img: '',
    ...userData.get(name)
  }

  return result;
}

function updateUserData(data: Partial<UserData> & { name: string }) {
  const { name, ...patch } = data;

  userData.set(name, {
    ...getUserData(name),

    // overwrite data
    ...patch
  });
}

function getWatchImg() {
  return (
    // saved image
    watchData.img
    // live image
    ?? userData.get(watchData.name)?.img
    // no image found
    ?? ''
  );
}

function setWatchImg(wd: WatchData) {
  watchData = wd;
}

// runs on the server
// inferred type used in client
export const rpcRouter = t.router({
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

        const { primaryColor, secondaryColor } = getUserData(targetName);
        onNewColors({
          name: targetName,
          primaryColor,
          secondaryColor
        });

        return () => ee.off('ce', onNewColors);
      });
    }),

  kickUser: t.procedure
    .input(
      z.object({
        name: z.string()
      })
    )
    .mutation((req) => {
      userData.delete(req.input.name);
    }),

  // watch all users if name not specified
  watchUser: t.procedure
    .input(
      z.object({
        name: z.string().optional()
      })
    )
    .subscription((req) => {
      return observable<UserData & { name: string }>(emit => {
        const onUserUpdated = (name: string) => {
          if (!req.input.name || name === req.input.name) {
            emit.next({
              name,
              ...getUserData(name)
            });
          }
        };

        ee.on('uu', onUserUpdated);

        for (const name of userData.keys()) onUserUpdated(name);

        return () => ee.off('uu', onUserUpdated);
      });
    }),

  watchWatch: t.procedure
    .subscription((req) => {
      return observable<{ name: string, img: string, live: boolean }>(emit => {
        const onWatchUpdated = () => {
          emit.next({
            name: watchData.name,
            img: getWatchImg(),
            live: !watchData.img
          });
        };

        // send the current state
        onWatchUpdated();

        ee.on('wu', onWatchUpdated);

        return () => ee.off('wu', onWatchUpdated);
      })
    }),

  setWatch: t.procedure
    .input(
      z.object({
        name: z.string(),
        img: z.string().optional()
      })
    ).mutation((req) => {
      const { input } = req;

      if (input.img) setWatchImg(input);
      else setWatchImg({ name: input.name });
      ee.emit('wu');
    }),

  setUserState: t.procedure
    .input(
      z.object({
        // assume sender if not specified
        name: z.string().optional(),
        img: z.string().optional(),
        primaryColor: z.string().optional(),
        secondaryColor: z.string().optional()
      })
    )
    .mutation((req) => {
      const { input, ctx } = req;
      const name = input.name ?? ctx.name;
      const data = {
        ...req.input,
        name
      }

      updateUserData({
        ...req.input,
        name
      });

      // if (data.img) ee.emit('ie', data);
      if (data.img) ee.emit('ie', getUserData(name));
      if (data.primaryColor || data.secondaryColor) ee.emit('ce', data);
      ee.emit('uu', name);
      if (data.name === watchData.name) ee.emit('wu');
    })
});

export type RPCRouter = typeof rpcRouter;