import type { ScreenOutput } from '@obsidian-ui/core';

export interface SuccessStateConfig {
  title?: string;
  message: string;
  color?: number;
}

export function createSuccessState(config: SuccessStateConfig): ScreenOutput {
  return {
    embeds: [{
      title: config.title ?? '✅ Success',
      description: config.message,
      color: config.color ?? 0x57f287,
    }],
    actionRows: [],
  };
}
