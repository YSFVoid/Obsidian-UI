import type { ActionContext, ScreenDefinition } from './types.js';

export type ActionHandler = (ctx: ActionContext) => void | Promise<void>;

export function resolveAction(
  screen: ScreenDefinition,
  actionId: string,
): ActionHandler | undefined {
  return screen.actions?.[actionId];
}

export function buildActionId(screenId: string, action: string): string {
  return `${screenId}:${action}`;
}

export function parseActionId(compositeId: string): { screenId: string; action: string } | null {
  const sep = compositeId.indexOf(':');
  if (sep === -1) return null;
  return {
    screenId: compositeId.slice(0, sep),
    action: compositeId.slice(sep + 1),
  };
}
