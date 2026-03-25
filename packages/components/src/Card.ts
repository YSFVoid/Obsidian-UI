import type { UIEmbed, UIField, ThemeTokens } from '@obsidian-ui/core';

export interface CardConfig {
  title: string;
  description?: string;
  fields?: UIField[];
  footer?: string;
  color?: number;
  thumbnail?: string;
  image?: string;
  author?: { name: string; iconUrl?: string };
  timestamp?: boolean;
}

export function createCard(config: CardConfig, theme?: ThemeTokens): UIEmbed {
  return {
    title: config.title,
    description: config.description,
    color: config.color ?? theme?.colors.primary,
    fields: config.fields,
    footer: config.footer ?? theme?.branding.footer,
    thumbnail: config.thumbnail,
    image: config.image,
    author: config.author,
    timestamp: config.timestamp,
  };
}
