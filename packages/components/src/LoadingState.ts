import type { ScreenOutput } from '@obsidian-ui/core';

export interface LoadingStateConfig {
  title?: string;
  message?: string;
  color?: number;
}

export function createLoadingState(config: LoadingStateConfig = {}): ScreenOutput {
  return {
    embeds: [{
      title: config.title ?? '⏳ Loading...',
      description: config.message ?? 'Please wait while we process your request.',
      color: config.color ?? 0x5865f2,
    }],
    actionRows: [],
  };
}
