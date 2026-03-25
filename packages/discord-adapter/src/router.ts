import type { ObsidianApp, ActionContext, ScreenOutput, ResponseMode, UIModal } from '@obsidian-ui/core';
import { parseActionId, resolveAction, invokeLifecycle, SessionStore } from '@obsidian-ui/core';
import type { Interaction } from 'discord.js';
import { normalizeInteraction, type NormalizedInteraction } from './interactions.js';
import { sendResponse, buildModal } from './response.js';

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

    const ctx = this.buildContext(normalized);

    if (screen.onMount) {
      await invokeLifecycle(screen.onMount, ctx);
    }

    const output = await screen.render(ctx);
    await sendResponse(normalized.raw, output, this.app.theme, 'reply');
    return true;
  }

  private async handleAction(normalized: NormalizedInteraction): Promise<boolean> {
    const parsed = parseActionId(normalized.actionId);
    if (!parsed) return false;

    const screen = this.app.getScreen(parsed.screenId);
    if (!screen) return false;

    const handler = resolveAction(screen, parsed.action);
    const ctx = this.buildContext(normalized);

    if (handler) {
      await handler(ctx);
    }

    return true;
  }

  private buildContext(normalized: NormalizedInteraction): ActionContext {
    const state = this.sessions.getAccessor('user', normalized.userId);
    const interaction = normalized.raw;

    const ctx: ActionContext = {
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
      openScreen: async (screenId: string, params?: Record<string, unknown>) => {
        const screen = this.app.getScreen(screenId);
        if (!screen) throw new Error(`Screen not found: ${screenId}`);

        if (params) {
          for (const [k, v] of Object.entries(params)) {
            state.set(k, v);
          }
        }

        if (screen.onMount) await invokeLifecycle(screen.onMount, ctx);
        const output = await screen.render(ctx);
        await sendResponse(interaction, output, this.app.theme, 'reply');
      },
      refreshScreen: async () => {
        const parsed = parseActionId(normalized.actionId);
        const screenId = parsed?.screenId ?? normalized.actionId;
        const screen = this.app.getScreen(screenId);
        if (!screen) return;

        if (screen.onRefresh) await invokeLifecycle(screen.onRefresh, ctx);
        const output = await screen.render(ctx);
        await sendResponse(interaction, output, this.app.theme, 'update');
      },
      closeScreen: async () => {
        const parsed = parseActionId(normalized.actionId);
        const screenId = parsed?.screenId ?? normalized.actionId;
        const screen = this.app.getScreen(screenId);

        if (screen?.onUnmount) await invokeLifecycle(screen.onUnmount, ctx);

        if ((interaction as any).update) {
          await (interaction as any).update({
            content: '',
            embeds: [],
            components: [],
          });
        }
      },
      showModal: async (modal: UIModal) => {
        const discordModal = buildModal(modal);
        if ((interaction as any).showModal) {
          await (interaction as any).showModal(discordModal);
        }
      },
      respond: async (output: ScreenOutput, mode?: ResponseMode) => {
        await sendResponse(interaction, output, this.app.theme, mode ?? 'reply');
      },
    };

    return ctx;
  }
}
