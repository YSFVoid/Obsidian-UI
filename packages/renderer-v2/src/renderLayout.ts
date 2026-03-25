import type { V2Container, V2Element } from './renderScreen.js';

export interface LayoutConfig {
  direction?: 'vertical' | 'horizontal';
  spacing?: 'small' | 'large';
}

export function createContainer(
  children: V2Element[],
  accentColor?: number,
): V2Container {
  return {
    type: 'container',
    children,
    accentColor,
  };
}

export function createSeparator(spacing?: 'small' | 'large'): V2Element {
  return { type: 'separator', spacing };
}
