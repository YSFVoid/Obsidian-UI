import type {
  ObsidianApp,
  ActionContext,
  ScreenOutput,
  ScreenDefinition,
  ResponseMode,
  UIModal,
  StateScope,
  Renderer,
} from '@obsidian-ui/core';
import { parseActionId, resolveAction, invokeLifecycle, SessionStore } from '@obsidian-ui/core';
import type { Interaction } from 'discord.js';
import { normalizeInteraction, type NormalizedInteraction } from './interactions.js';
import { sendPayload } from './response.js';

export class InteractionRouter {
  private app: ObsidianApp;
  private sessions: SessionStore;

  constructor(app: ObsidianApp, sessions: SessionStore) {
    this.app = app;
    this.sessions = sessions;
  }

  async handle(interaction: Interaction): Promise<boolean> {
    const normalized = normalizeInteraction(interaction);
    if (!normalized) return false;

    if (normalized.source === 'slash_command') {
      return this.handleCommand(normalized);
    }

    return this.handleAction(normalized);
  }

  private async handleCommand(normalized: NormalizedInteraction): Promise<boolean> {
    const screen = this.app.getScreen(normalized.actionId);
    if (!screen) return false;

    const ctx = this.buildContext(normalized, screen);

    if (screen.onMount) {
      await invokeLifecycle(screen.onMount, ctx);
    }

    const output = await screen.render(ctx);
    const payload = this.app.renderer.render(output, this.app.theme);
    await sendPayload(normalized.raw, payload, 'reply');
    return true;
  }

  private async handleAction(normalized: NormalizedInteraction): Promise<boolean> {
    const parsed = parseActionId(normalized.actionId);
    if (!parsed) return false;

    const screen = this.app.getScreen(parsed.screenId);
    if (!screen) return false;

    const handler = resolveAction(screen, parsed.action);
    const ctx = this.buildContext(normalized, screen);

    if (handler) {
      await handler(ctx);
    }

    return true;
  }

  private resolveStateId(scope: StateScope, normalized: NormalizedInteraction): string {
    switch (scope) {
      case 'user': return normalized.userId;
      case 'channel': return normalized.channelId;
      case 'guild': return normalized.guildId ?? normalized.channelId;
      case 'message': return normalized.messageId ?? normalized.userId;
    }
  }

  private buildContext(normalized: NormalizedInteraction, screen: ScreenDefinition): ActionContext {
    const stateId = this.resolveStateId(screen.stateScope, normalized);
    const state = this.sessions.getAccessor(screen.stateScope, stateId);
    const interaction = normalized.raw;
    const renderer = this.app.renderer;
    const theme = this.app.theme;
    const screenId = screen.id;

    const ctx: ActionContext = {
      screenId,
      actionId: normalized.actionId,
      source: normalized.source,
      userId: normalized.userId,
      guildId: normalized.guildId,
      channelId: normalized.channelId,
      messageId: normalized.messageId,
      values: normalized.values,
      modalValues: normalized.modalValues,
      state,
      raw: interaction,

      openScreen: async (targetScreenId: string, params?: Record<string, unknown>) => {
        const targetScreen = this.app.getScreen(targetScreenId);
        if (!targetScreen) throw new Error(`Screen not found: ${targetScreenId}`);

        if (params) {
          for (const [k, v] of Object.entries(params)) {
            state.set(k, v);
          }
        }

        if (targetScreen.onMount) await invokeLifecycle(targetScreen.onMount, ctx);
        const output = await targetScreen.render(ctx);
        const payload = renderer.render(output, theme);
        await sendPayload(interaction, payload, 'reply');
      },

      refreshScreen: async () => {
        if (screen.onRefresh) await invokeLifecycle(screen.onRefresh, ctx);
        const output = await screen.render(ctx);
        const payload = renderer.render(output, theme);
        await sendPayload(interaction, payload, 'update');
      },

      closeScreen: async () => {
        if (screen.onUnmount) await invokeLifecycle(screen.onUnmount, ctx);

        if ('update' in interaction && typeof (interaction as any).update === 'function') {
          await (interaction as any).update({ content: '', embeds: [], components: [] });
        }
      },

      showModal: async (modal: UIModal) => {
        const built = renderer.buildModal(modal);
        if (built && 'showModal' in interaction && typeof (interaction as any).showModal === 'function') {
          await (interaction as any).showModal(built);
        }
      },

      respond: async (output: ScreenOutput, mode?: ResponseMode) => {
        const payload = renderer.render(output, theme);
        await sendPayload(interaction, payload, mode ?? 'reply');
      },
    };

    return ctx;
  }
}
