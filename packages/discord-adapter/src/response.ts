import type { Interaction } from 'discord.js';
import type { RenderPayload, ResponseMode } from '@obsidian-ui/core';

export async function sendPayload(
  interaction: Interaction,
  payload: RenderPayload,
  mode: ResponseMode = 'reply',
): Promise<void> {
  const data = payload.data as Record<string, unknown>;

  if (mode === 'reply' && isRepliable(interaction)) {
    await (interaction as any).reply(data);
  } else if (mode === 'update' && isUpdatable(interaction)) {
    await (interaction as any).update(data);
  } else if (mode === 'followup' && isRepliable(interaction)) {
    await (interaction as any).followUp(data);
  } else if (mode === 'ephemeral' && isRepliable(interaction)) {
    await (interaction as any).reply({ ...data, ephemeral: true });
  } else if (mode === 'public' && isRepliable(interaction)) {
    await (interaction as any).reply({ ...data, ephemeral: false });
  }
}

function isRepliable(interaction: Interaction): boolean {
  return 'reply' in interaction && typeof (interaction as any).reply === 'function';
}

function isUpdatable(interaction: Interaction): boolean {
  return 'update' in interaction && typeof (interaction as any).update === 'function';
}
