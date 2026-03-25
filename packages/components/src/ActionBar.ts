import type { UIActionRow, UIActionButton } from '@obsidian-ui/core';

export interface ActionBarAction {
  id: string;
  label: string;
  style?: 'primary' | 'secondary' | 'success' | 'danger';
  emoji?: string;
  disabled?: boolean;
}

export interface ActionBarConfig {
  screenId: string;
  actions: ActionBarAction[];
}

export function createActionBar(config: ActionBarConfig): UIActionRow {
  const { screenId, actions } = config;

  const buttons: UIActionButton[] = actions.map(action => ({
    type: 'button',
    id: `${screenId}:${action.id}`,
    label: action.label,
    style: action.style ?? 'secondary',
    emoji: action.emoji,
    disabled: action.disabled,
  }));

  return { actions: buttons };
}
