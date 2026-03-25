import type { ScreenOutput, ThemeTokens, RendererContract } from '@obsidian-ui/core';

export interface V2RenderResult {
  type: 'v2';
  containers: V2Container[];
}

export interface V2Container {
  type: 'container';
  children: V2Element[];
  accentColor?: number;
}

export type V2Element =
  | V2TextDisplay
  | V2Section
  | V2ActionRow
  | V2Separator;

export interface V2TextDisplay {
  type: 'text_display';
  content: string;
}

export interface V2Section {
  type: 'section';
  components: V2Element[];
}

export interface V2ActionRow {
  type: 'action_row';
  components: unknown[];
}

export interface V2Separator {
  type: 'separator';
  spacing?: 'small' | 'large';
}

export function renderScreenV2(output: ScreenOutput, theme: ThemeTokens): V2RenderResult {
  const containers: V2Container[] = [];

  for (const embed of output.embeds) {
    const children: V2Element[] = [];

    if (embed.title) {
      children.push({ type: 'text_display', content: `## ${embed.title}` });
    }
    if (embed.description) {
      children.push({ type: 'text_display', content: embed.description });
    }
    if (embed.fields) {
      for (const field of embed.fields) {
        children.push({
          type: 'text_display',
          content: `**${field.name}**\n${field.value}`,
        });
      }
    }

    containers.push({
      type: 'container',
      children,
      accentColor: embed.color ?? theme.colors.primary,
    });
  }

  return { type: 'v2', containers };
}

export const v2Renderer: RendererContract = {
  renderScreen: renderScreenV2,
};
