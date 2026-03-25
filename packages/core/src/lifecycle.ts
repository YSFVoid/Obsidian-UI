import type { ActionContext } from './types.js';

export interface LifecycleHooks {
  onMount?: (ctx: ActionContext) => void | Promise<void>;
  onRefresh?: (ctx: ActionContext) => void | Promise<void>;
  onUnmount?: (ctx: ActionContext) => void | Promise<void>;
}

export async function invokeLifecycle(
  hook: ((ctx: ActionContext) => void | Promise<void>) | undefined,
  ctx: ActionContext,
): Promise<void> {
  if (hook) await hook(ctx);
}
