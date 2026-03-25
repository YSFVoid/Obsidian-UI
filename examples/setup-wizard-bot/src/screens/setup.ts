import {
  createScreen,
  type ScreenOutput,
  buildActionId,
} from '@obsidian-ui/core';
import {
  renderWizardStep,
  handleWizardAction,
  createConfirmDialog,
  createSuccessState,
  createErrorState,
  type WizardConfig,
} from '@obsidian-ui/components';

const SCREEN_ID = 'setup';

const wizardConfig: WizardConfig = {
  screenId: SCREEN_ID,
  steps: [
    {
      id: 'welcome',
      title: '🔧 Server Setup Wizard',
      description:
        'Welcome to the server setup wizard.\n\n' +
        'This will walk you through configuring your server with the following steps:\n\n' +
        '1️⃣ **Server Name & Description**\n' +
        '2️⃣ **Moderation Settings**\n' +
        '3️⃣ **Notification Preferences**\n' +
        '4️⃣ **Review & Confirm**',
      color: 0x5865f2,
    },
    {
      id: 'server_info',
      title: '📝 Server Information',
      description: 'Provide your server name and description.\n\nClick **Fill In** to enter details.',
      color: 0x5865f2,
      modal: {
        id: `${SCREEN_ID}:modal_server_info`,
        title: 'Server Information',
        fields: [
          {
            id: 'server_name',
            label: 'Server Name',
            style: 'short',
            placeholder: 'My Awesome Server',
            required: true,
            maxLength: 100,
          },
          {
            id: 'server_description',
            label: 'Server Description',
            style: 'paragraph',
            placeholder: 'A brief description of your server...',
            required: false,
            maxLength: 500,
          },
        ],
      },
    },
    {
      id: 'moderation',
      title: '🛡️ Moderation Settings',
      description: 'Configure your moderation preferences.\n\nClick **Fill In** to set moderation rules.',
      color: 0xfee75c,
      modal: {
        id: `${SCREEN_ID}:modal_moderation`,
        title: 'Moderation Settings',
        fields: [
          {
            id: 'auto_mod',
            label: 'Auto-Moderation Level',
            style: 'short',
            placeholder: 'low / medium / high',
            required: true,
          },
          {
            id: 'warn_threshold',
            label: 'Warning Threshold Before Ban',
            style: 'short',
            placeholder: '3',
            required: true,
          },
        ],
      },
    },
    {
      id: 'review',
      title: '📋 Review Configuration',
      description: 'Review your settings before applying.',
      color: 0x57f287,
    },
  ],
};

export const setupScreen = createScreen({
  id: SCREEN_ID,

  onMount(ctx) {
    ctx.state.set('wizardStep', 0);
    ctx.state.set('setupPhase', 'wizard');
  },

  render(ctx): ScreenOutput {
    const phase = ctx.state.get<string>('setupPhase') ?? 'wizard';

    if (phase === 'confirm') {
      const serverName = ctx.state.get<string>('server_name') ?? 'Unnamed';
      const serverDesc = ctx.state.get<string>('server_description') ?? 'No description';
      const autoMod = ctx.state.get<string>('auto_mod') ?? 'medium';
      const warnThreshold = ctx.state.get<string>('warn_threshold') ?? '3';

      const confirm = createConfirmDialog({
        screenId: SCREEN_ID,
        title: '✅ Apply Configuration?',
        message:
          `**Server Name:** ${serverName}\n` +
          `**Description:** ${serverDesc}\n` +
          `**Auto-Mod:** ${autoMod}\n` +
          `**Warn Threshold:** ${warnThreshold}\n\n` +
          'Apply these settings to your server?',
        confirmLabel: 'Apply Settings',
        cancelLabel: 'Go Back',
        destructive: false,
        color: 0x57f287,
      });

      return {
        embeds: [confirm.embed],
        actionRows: [confirm.actionRow],
      };
    }

    const stepIndex = ctx.state.get<number>('wizardStep') ?? 0;
    const result = renderWizardStep(wizardConfig, stepIndex);

    if (wizardConfig.steps[stepIndex].id === 'review') {
      const serverName = ctx.state.get<string>('server_name') ?? 'Not set';
      const serverDesc = ctx.state.get<string>('server_description') ?? 'Not set';
      const autoMod = ctx.state.get<string>('auto_mod') ?? 'Not set';
      const warnThreshold = ctx.state.get<string>('warn_threshold') ?? 'Not set';

      result.output.embeds[0].fields = [
        { name: 'Server Name', value: serverName, inline: true },
        { name: 'Description', value: serverDesc, inline: true },
        { name: 'Auto-Mod Level', value: autoMod, inline: true },
        { name: 'Warn Threshold', value: warnThreshold, inline: true },
      ];
    }

    return result.output;
  },

  actions: {
    wizard_next(ctx) {
      handleWizardAction(ctx);
      ctx.refreshScreen();
    },

    wizard_back(ctx) {
      handleWizardAction(ctx);
      ctx.refreshScreen();
    },

    wizard_cancel(ctx) {
      const output = createErrorState({
        title: 'Setup Cancelled',
        message: 'The setup wizard was cancelled. Run `/setup` to start again.',
      });
      ctx.respond(output, 'update');
    },

    wizard_input(ctx) {
      const stepIndex = ctx.state.get<number>('wizardStep') ?? 0;
      const step = wizardConfig.steps[stepIndex];
      if (step.modal) {
        ctx.showModal(step.modal);
      }
    },

    wizard_complete(ctx) {
      ctx.state.set('setupPhase', 'confirm');
      ctx.refreshScreen();
    },

    confirm(ctx) {
      const output = createSuccessState({
        title: 'Configuration Applied',
        message:
          'Your server has been configured successfully.\n\n' +
          `**Server:** ${ctx.state.get<string>('server_name') ?? 'Unknown'}\n` +
          `**Auto-Mod:** ${ctx.state.get<string>('auto_mod') ?? 'Unknown'}`,
      });
      ctx.respond(output, 'update');
    },

    cancel(ctx) {
      ctx.state.set('setupPhase', 'wizard');
      ctx.refreshScreen();
    },

    async modal_server_info(ctx) {
      if (ctx.modalValues) {
        ctx.state.set('server_name', ctx.modalValues['server_name'] ?? '');
        ctx.state.set('server_description', ctx.modalValues['server_description'] ?? '');
      }
      const stepIndex = ctx.state.get<number>('wizardStep') ?? 0;
      ctx.state.set('wizardStep', stepIndex + 1);
      ctx.refreshScreen();
    },

    async modal_moderation(ctx) {
      if (ctx.modalValues) {
        ctx.state.set('auto_mod', ctx.modalValues['auto_mod'] ?? '');
        ctx.state.set('warn_threshold', ctx.modalValues['warn_threshold'] ?? '');
      }
      const stepIndex = ctx.state.get<number>('wizardStep') ?? 0;
      ctx.state.set('wizardStep', stepIndex + 1);
      ctx.refreshScreen();
    },
  },
});
