import type { ScreenOutput } from '@obsidian-ui/core';

export interface EmptyStateConfig {
  title?: string;
  message: string;
  emoji?: string;
  color?: number;
}

export function createEmptyState(config: EmptyStateConfig): ScreenOutput {
  const emoji = config.emoji ?? '📭';
  return {
    embeds: [{
      title: config.title ?? `${emoji} Nothing Here`,
      description: config.message,
      color: config.color,
    }],
    actionRows: [],
  };
}
