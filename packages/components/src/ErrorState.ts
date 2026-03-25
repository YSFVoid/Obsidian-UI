import type { ScreenOutput, UIActionButton, UIActionRow } from '@obsidian-ui/core';

export interface ErrorStateConfig {
  title?: string;
  message: string;
  color?: number;
  retryAction?: { screenId: string; actionId: string; label?: string };
}

export function createErrorState(config: ErrorStateConfig): ScreenOutput {
  const actionRows: UIActionRow[] = [];

  if (config.retryAction) {
    const retryButton: UIActionButton = {
      type: 'button',
      id: `${config.retryAction.screenId}:${config.retryAction.actionId}`,
      label: config.retryAction.label ?? '🔄 Retry',
      style: 'primary',
    };
    actionRows.push({ actions: [retryButton] });
  }

  return {
    embeds: [{
      title: config.title ?? '❌ Error',
      description: config.message,
      color: config.color ?? 0xed4245,
    }],
    actionRows,
  };
}
