import type { ThemeTokens } from '@obsidian-ui/core';

export interface ThemeDefinition extends ThemeTokens {
  name: string;
}

export interface ThemePreset {
  name: string;
  description: string;
  theme: ThemeDefinition;
}
