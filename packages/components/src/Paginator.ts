import type { UIActionRow, UIActionButton, ActionContext, ScreenOutput, UIEmbed } from '@obsidian-ui/core';

export interface PaginatorConfig<T> {
  items: T[];
  pageSize: number;
  screenId: string;
  renderItem: (item: T, index: number) => string;
  title?: string;
  color?: number;
  emptyMessage?: string;
}

export interface PaginatorResult {
  embed: UIEmbed;
  actionRow: UIActionRow;
  currentPage: number;
  totalPages: number;
}

export function createPaginator<T>(
  config: PaginatorConfig<T>,
  currentPage: number = 0,
): PaginatorResult {
  const { items, pageSize, screenId, renderItem, title, color, emptyMessage } = config;
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const page = Math.max(0, Math.min(currentPage, totalPages - 1));
  const start = page * pageSize;
  const pageItems = items.slice(start, start + pageSize);

  let description: string;
  if (pageItems.length === 0) {
    description = emptyMessage ?? 'No items to display.';
  } else {
    description = pageItems.map((item, i) => renderItem(item, start + i)).join('\n');
  }

  const embed: UIEmbed = {
    title: title ?? 'List',
    description,
    color,
    footer: `Page ${page + 1} of ${totalPages}`,
  };

  const prevButton: UIActionButton = {
    type: 'button',
    id: `${screenId}:page_prev`,
    label: '◀ Previous',
    style: 'secondary',
    disabled: page <= 0,
  };

  const pageIndicator: UIActionButton = {
    type: 'button',
    id: `${screenId}:page_info`,
    label: `${page + 1} / ${totalPages}`,
    style: 'secondary',
    disabled: true,
  };

  const nextButton: UIActionButton = {
    type: 'button',
    id: `${screenId}:page_next`,
    label: 'Next ▶',
    style: 'secondary',
    disabled: page >= totalPages - 1,
  };

  return {
    embed,
    actionRow: { actions: [prevButton, pageIndicator, nextButton] },
    currentPage: page,
    totalPages,
  };
}

export function handlePaginatorAction(
  ctx: ActionContext,
  stateKey: string = 'currentPage',
): number | null {
  const action = ctx.actionId.split(':').pop();
  const currentPage = ctx.state.get<number>(stateKey) ?? 0;

  if (action === 'page_next') {
    const next = currentPage + 1;
    ctx.state.set(stateKey, next);
    return next;
  }
  if (action === 'page_prev') {
    const prev = Math.max(0, currentPage - 1);
    ctx.state.set(stateKey, prev);
    return prev;
  }
  return null;
}
