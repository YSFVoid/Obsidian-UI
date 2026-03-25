import type { UIEmbed, UIField } from '@obsidian-ui/core';

export interface StatEntry {
  label: string;
  value: string;
  inline?: boolean;
}

export interface StatsGridConfig {
  title?: string;
  description?: string;
  stats: StatEntry[];
  color?: number;
  footer?: string;
}

export function createStatsGrid(config: StatsGridConfig): UIEmbed {
  const fields: UIField[] = config.stats.map(stat => ({
    name: stat.label,
    value: stat.value,
    inline: stat.inline ?? true,
  }));

  return {
    title: config.title,
    description: config.description,
    fields,
    color: config.color,
    footer: config.footer,
  };
}
