import type { UIEmbed, UIField, ThemeTokens } from '@obsidian-ui/core';

export interface CardSchema {
  title: string;
  description?: string;
  color?: number;
  fields?: UIField[];
  footer?: string;
  thumbnail?: string;
  image?: string;
  author?: { name: string; iconUrl?: string };
  timestamp?: boolean;
}

export function renderCardEmbed(card: CardSchema, theme: ThemeTokens): UIEmbed {
  return {
    title: card.title,
    description: card.description,
    color: card.color ?? theme.colors.primary,
    fields: card.fields,
    footer: card.footer ?? theme.branding.footer,
    thumbnail: card.thumbnail,
    image: card.image,
    author: card.author,
    timestamp: card.timestamp,
  };
}
