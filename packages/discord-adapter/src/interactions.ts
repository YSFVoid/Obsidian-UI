import {
  type Interaction,
  type ChatInputCommandInteraction,
  type ButtonInteraction,
  type StringSelectMenuInteraction,
  type ModalSubmitInteraction,
} from 'discord.js';
import type { InteractionSource } from '@obsidian-ui/core';

export interface NormalizedInteraction {
  actionId: string;
  source: InteractionSource;
  userId: string;
  guildId: string | null;
  channelId: string;
  messageId?: string;
  values?: string[];
  modalValues?: Record<string, string>;
  raw: Interaction;
}

export function normalizeInteraction(interaction: Interaction): NormalizedInteraction | null {
  if (interaction.isChatInputCommand()) {
    return normalizeSlashCommand(interaction);
  }
  if (interaction.isButton()) {
    return normalizeButton(interaction);
  }
  if (interaction.isStringSelectMenu()) {
    return normalizeSelectMenu(interaction);
  }
  if (interaction.isModalSubmit()) {
    return normalizeModalSubmit(interaction);
  }
  return null;
}

function normalizeSlashCommand(i: ChatInputCommandInteraction): NormalizedInteraction {
  return {
    actionId: i.commandName,
    source: 'slash_command',
    userId: i.user.id,
    guildId: i.guildId,
    channelId: i.channelId!,
    raw: i,
  };
}

function normalizeButton(i: ButtonInteraction): NormalizedInteraction {
  return {
    actionId: i.customId,
    source: 'button',
    userId: i.user.id,
    guildId: i.guildId,
    channelId: i.channelId!,
    messageId: i.message.id,
    raw: i,
  };
}

function normalizeSelectMenu(i: StringSelectMenuInteraction): NormalizedInteraction {
  return {
    actionId: i.customId,
    source: 'select_menu',
    userId: i.user.id,
    guildId: i.guildId,
    channelId: i.channelId!,
    messageId: i.message.id,
    values: i.values,
    raw: i,
  };
}

function normalizeModalSubmit(i: ModalSubmitInteraction): NormalizedInteraction {
  const modalValues: Record<string, string> = {};
  for (const [key, component] of i.fields.fields) {
    if ('value' in component) {
      modalValues[key] = component.value;
    }
  }
  return {
    actionId: i.customId,
    source: 'modal_submit',
    userId: i.user.id,
    guildId: i.guildId,
    channelId: i.channelId!,
    modalValues,
    raw: i,
  };
}
