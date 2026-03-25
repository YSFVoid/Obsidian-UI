import type { UIEmbed, UIActionRow, UIActionButton } from '@obsidian-ui/core';

export interface ConfirmDialogConfig {
  screenId: string;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  color?: number;
}

export interface ConfirmDialogResult {
  embed: UIEmbed;
  actionRow: UIActionRow;
}

export function createConfirmDialog(config: ConfirmDialogConfig): ConfirmDialogResult {
  const {
    screenId,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    destructive = false,
    color,
  } = config;

  const embed: UIEmbed = {
    title,
    description: message,
    color: color ?? (destructive ? 0xed4245 : 0x5865f2),
  };

  const confirmButton: UIActionButton = {
    type: 'button',
    id: `${screenId}:confirm`,
    label: confirmLabel,
    style: destructive ? 'danger' : 'success',
  };

  const cancelButton: UIActionButton = {
    type: 'button',
    id: `${screenId}:cancel`,
    label: cancelLabel,
    style: 'secondary',
  };

  return {
    embed,
    actionRow: { actions: [confirmButton, cancelButton] },
  };
}
