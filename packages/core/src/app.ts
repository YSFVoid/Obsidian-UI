import type { AppConfig, ObsidianApp, ScreenDefinition, ThemeTokens } from './types.js';

const DEFAULT_THEME: ThemeTokens = {
  name: 'obsidian',
  colors: {
    primary: 0x5865f2,
    secondary: 0x2f3136,
    success: 0x57f287,
    danger: 0xed4245,
    warning: 0xfee75c,
    info: 0x5865f2,
    muted: 0x4f545c,
    background: 0x2f3136,
  },
  branding: {
    footer: 'Obsidian UI',
  },
};

export function createObsidianApp(config: AppConfig): ObsidianApp {
  const screens = new Map<string, ScreenDefinition>();

  for (const screen of config.screens) {
    if (screens.has(screen.id)) {
      throw new Error(`Duplicate screen id: ${screen.id}`);
    }
    screens.set(screen.id, screen);
  }

  const theme = config.theme ?? DEFAULT_THEME;

  return {
    config,
    screens,
    getScreen: (id: string) => screens.get(id),
    theme,
  };
}
