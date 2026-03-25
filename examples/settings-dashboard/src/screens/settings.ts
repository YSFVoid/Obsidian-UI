import {
  createScreen,
  type ScreenOutput,
  buildActionId,
} from '@obsidian-ui/core';
import {
  createTabs,
  resolveTabAction,
  createStatsGrid,
  createSettingsPanel,
  createActionBar,
  createEmptyState,
  createSuccessState,
  type TabDefinition,
} from '@obsidian-ui/components';

const SCREEN_ID = 'settings';

function getOverviewTab(ctx: { state: { get<T>(k: string): T | undefined } }): TabDefinition {
  return {
    id: 'overview',
    label: 'Overview',
    emoji: '📊',
    render: () => createStatsGrid({
      title: '📊 Server Overview',
      stats: [
        { label: 'Members', value: '**1,247**' },
        { label: 'Online', value: '**328**' },
        { label: 'Messages Today', value: '**4,891**' },
        { label: 'Active Channels', value: '**12**' },
        { label: 'Warnings Issued', value: '**3**' },
        { label: 'Uptime', value: '**99.8%**' },
      ],
      color: 0x5865f2,
      footer: 'Last updated just now',
    }),
  };
}

function getModerationTab(): TabDefinition {
  return {
    id: 'moderation',
    label: 'Moderation',
    emoji: '🛡️',
    render: () => {
      const panel = createSettingsPanel({
        screenId: SCREEN_ID,
        title: '🛡️ Moderation Settings',
        settings: [
          { label: 'Auto-Mod Level', value: '`High`', description: 'Automatically filters spam and inappropriate content' },
          { label: 'Warn Threshold', value: '`3 warnings`', description: 'Users are banned after this many warnings' },
          { label: 'Mute Duration', value: '`30 minutes`', description: 'Default duration for muted users' },
          { label: 'Log Channel', value: '`#mod-logs`', description: 'Channel where moderation actions are logged' },
        ],
        color: 0xfee75c,
      });
      return panel.embed;
    },
  };
}

function getNotificationsTab(): TabDefinition {
  return {
    id: 'notifications',
    label: 'Notifications',
    emoji: '🔔',
    render: () => {
      const panel = createSettingsPanel({
        screenId: SCREEN_ID,
        title: '🔔 Notification Settings',
        settings: [
          { label: 'Welcome Messages', value: '`Enabled`', description: 'Send a message when new members join' },
          { label: 'Leave Messages', value: '`Disabled`' },
          { label: 'Level-Up Alerts', value: '`Enabled`', description: 'Notify when members reach new levels' },
          { label: 'Boost Alerts', value: '`Enabled`', description: 'Announce server boosts' },
        ],
        color: 0x57f287,
      });
      return panel.embed;
    },
  };
}

export const settingsScreen = createScreen({
  id: SCREEN_ID,
  stateScope: 'guild',

  onMount(ctx) {
    ctx.state.set('activeTab', 'overview');
  },

  render(ctx): ScreenOutput {
    const activeTab = ctx.state.get<string>('activeTab') ?? 'overview';

    const tabs = createTabs({
      screenId: SCREEN_ID,
      tabs: [
        getOverviewTab(ctx),
        getModerationTab(),
        getNotificationsTab(),
      ],
      activeTab,
    });

    const actionBar = createActionBar({
      screenId: SCREEN_ID,
      actions: [
        { id: 'refresh', label: 'Refresh', emoji: '🔄', style: 'primary' },
        { id: 'reset', label: 'Reset Defaults', emoji: '⚙️', style: 'danger' },
      ],
    });

    return {
      embeds: tabs.output.embeds,
      actionRows: [...tabs.output.actionRows, actionBar],
    };
  },

  actions: {
    tab_overview(ctx) {
      ctx.state.set('activeTab', 'overview');
      ctx.refreshScreen();
    },
    tab_moderation(ctx) {
      ctx.state.set('activeTab', 'moderation');
      ctx.refreshScreen();
    },
    tab_notifications(ctx) {
      ctx.state.set('activeTab', 'notifications');
      ctx.refreshScreen();
    },
    refresh(ctx) {
      ctx.refreshScreen();
    },
    reset(ctx) {
      ctx.state.set('activeTab', 'overview');
      const output = createSuccessState({
        title: 'Settings Reset',
        message: 'All settings have been reset to their default values.',
      });
      ctx.respond(output, 'update');
    },
  },
});
