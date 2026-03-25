import type { UIEmbed, UIActionRow, UIActionButton, ScreenOutput } from '@obsidian-ui/core';

export interface TabDefinition {
  id: string;
  label: string;
  emoji?: string;
  render: () => UIEmbed;
}

export interface TabsConfig {
  screenId: string;
  tabs: TabDefinition[];
  activeTab?: string;
  color?: number;
}

export interface TabsResult {
  output: ScreenOutput;
  activeTabId: string;
}

export function createTabs(config: TabsConfig): TabsResult {
  const { screenId, tabs, color } = config;
  const activeId = config.activeTab ?? tabs[0]?.id ?? '';
  const activeTab = tabs.find(t => t.id === activeId) ?? tabs[0];

  const embed = activeTab ? activeTab.render() : { title: 'No tabs', description: 'No content available.' };
  if (color !== undefined && !embed.color) embed.color = color;

  const tabButtons: UIActionButton[] = tabs.map(tab => ({
    type: 'button',
    id: `${screenId}:tab_${tab.id}`,
    label: tab.label,
    emoji: tab.emoji,
    style: tab.id === activeId ? 'primary' : 'secondary',
    disabled: tab.id === activeId,
  }));

  return {
    output: {
      embeds: [embed],
      actionRows: [{ actions: tabButtons }],
    },
    activeTabId: activeId,
  };
}

export function resolveTabAction(actionId: string): string | null {
  const suffix = actionId.split(':').pop();
  if (suffix?.startsWith('tab_')) return suffix.slice(4);
  return null;
}
