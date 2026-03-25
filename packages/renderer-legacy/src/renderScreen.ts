import type { ScreenOutput, ThemeTokens, UIEmbed, UIActionRow } from '@obsidian-ui/core';
import { renderCardEmbed } from './renderCard.js';
import { renderActionRows } from './renderActions.js';

export interface LegacyRenderResult {
  embeds: UIEmbed[];
  actionRows: UIActionRow[];
  ephemeral?: boolean;
}

export function renderScreen(output: ScreenOutput, theme: ThemeTokens): LegacyRenderResult {
  const embeds = output.embeds.map(embed => ({
    ...embed,
    color: embed.color ?? theme.colors.primary,
    footer: embed.footer ?? theme.branding.footer,
  }));

  return {
    embeds,
    actionRows: output.actionRows,
    ephemeral: output.ephemeral,
  };
}
