import type { ScreenConfig, ScreenDefinition } from './types.js';

export function createScreen(config: ScreenConfig): ScreenDefinition {
  return {
    id: config.id,
    render: config.render,
    actions: config.actions ?? {},
    onMount: config.onMount,
    onRefresh: config.onRefresh,
    onUnmount: config.onUnmount,
  };
}
