import type { ThemeTokens } from '@obsidian-ui/core';
import type { ThemeDefinition, ThemePreset } from './types.js';

export function defineTheme(definition: ThemeDefinition): ThemeTokens {
  return { ...definition };
}

export type { ThemeDefinition, ThemePreset } from './types.js';
export { obsidianTheme } from './obsidian.js';
export { neonTheme } from './neon.js';
