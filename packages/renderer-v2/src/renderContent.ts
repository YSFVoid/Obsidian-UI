import type { V2TextDisplay, V2Section, V2Element } from './renderScreen.js';

export function createTextDisplay(content: string): V2TextDisplay {
  return { type: 'text_display', content };
}

export function createSection(components: V2Element[]): V2Section {
  return { type: 'section', components };
}
