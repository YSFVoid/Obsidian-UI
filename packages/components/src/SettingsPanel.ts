import type { UIEmbed, UIField, UIActionRow, UIActionButton } from '@obsidian-ui/core';

export interface SettingRow {
  label: string;
  value: string;
  description?: string;
}

export interface SettingAction {
  id: string;
  label: string;
  emoji?: string;
  style?: 'primary' | 'secondary' | 'success' | 'danger';
}

export interface SettingsPanelConfig {
  screenId: string;
  title: string;
  description?: string;
  settings: SettingRow[];
  actions?: SettingAction[];
  color?: number;
  footer?: string;
}

export interface SettingsPanelResult {
  embed: UIEmbed;
  actionRow?: UIActionRow;
}

export function createSettingsPanel(config: SettingsPanelConfig): SettingsPanelResult {
  const { screenId, title, settings, actions, color, footer } = config;

  const fields: UIField[] = settings.map(s => ({
    name: s.label,
    value: s.description ? `${s.value}\n*${s.description}*` : s.value,
    inline: false,
  }));

  const embed: UIEmbed = {
    title,
    description: config.description,
    fields,
    color,
    footer,
  };

  let actionRow: UIActionRow | undefined;
  if (actions?.length) {
    const buttons: UIActionButton[] = actions.map(a => ({
      type: 'button',
      id: `${screenId}:${a.id}`,
      label: a.label,
      emoji: a.emoji,
      style: a.style ?? 'primary',
    }));
    actionRow = { actions: buttons };
  }

  return { embed, actionRow };
}
