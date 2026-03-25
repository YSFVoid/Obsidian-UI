import { Client, type ClientOptions, Events } from 'discord.js';
import type { ObsidianApp } from '@obsidian-ui/core';
import { SessionStore } from '@obsidian-ui/core';
import { InteractionRouter } from './router.js';

export interface DiscordAdapterConfig {
  client: Client;
  app: ObsidianApp;
  sessionTTL?: number;
}

export interface DiscordAdapter {
  router: InteractionRouter;
  sessions: SessionStore;
  start: (token: string) => Promise<void>;
  destroy: () => void;
}

export function createDiscordAdapter(config: DiscordAdapterConfig): DiscordAdapter {
  const sessions = new SessionStore({
    ttl: config.sessionTTL ?? config.app.config.sessionTTL ?? 30 * 60 * 1000,
  });

  const router = new InteractionRouter(config.app, sessions);

  config.client.on(Events.InteractionCreate, async (interaction) => {
    try {
      await router.handle(interaction);
    } catch (error) {
      console.error('[obsidian-ui] Interaction handling error:', error);

      try {
        if ((interaction as any).replied || (interaction as any).deferred) {
          await (interaction as any).followUp({
            content: 'An error occurred while processing this interaction.',
            ephemeral: true,
          });
        } else if ((interaction as any).reply) {
          await (interaction as any).reply({
            content: 'An error occurred while processing this interaction.',
            ephemeral: true,
          });
        }
      } catch {
        // Exhausted recovery options
      }
    }
  });

  return {
    router,
    sessions,
    start: async (token: string) => {
      await config.client.login(token);
    },
    destroy: () => {
      sessions.destroy();
      config.client.destroy();
    },
  };
}
