import type { UIActionRow, UIAction, UIActionButton, UIActionSelect } from '@obsidian-ui/core';

export function renderActionRows(rows: UIActionRow[]): UIActionRow[] {
  return rows.map(row => ({
    actions: row.actions.map(action => normalizeAction(action)),
  }));
}

function normalizeAction(action: UIAction): UIAction {
  if (action.type === 'button') {
    return {
      ...action,
      style: action.style ?? 'primary',
      disabled: action.disabled ?? false,
    };
  }
  if (action.type === 'select') {
    return {
      ...action,
      minValues: action.minValues ?? 1,
      maxValues: action.maxValues ?? 1,
      disabled: action.disabled ?? false,
    };
  }
  return action;
}
