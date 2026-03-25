import type { UIActionRow, UIActionButton } from '@obsidian-ui/core';

export interface PaginatorState {
  currentPage: number;
  totalPages: number;
  screenId: string;
}

export function renderPaginatorRow(state: PaginatorState): UIActionRow {
  const { currentPage, totalPages, screenId } = state;

  const prevButton: UIActionButton = {
    type: 'button',
    id: `${screenId}:page_prev`,
    label: '◀ Previous',
    style: 'secondary',
    disabled: currentPage <= 0,
  };

  const pageIndicator: UIActionButton = {
    type: 'button',
    id: `${screenId}:page_info`,
    label: `${currentPage + 1} / ${totalPages}`,
    style: 'secondary',
    disabled: true,
  };

  const nextButton: UIActionButton = {
    type: 'button',
    id: `${screenId}:page_next`,
    label: 'Next ▶',
    style: 'secondary',
    disabled: currentPage >= totalPages - 1,
  };

  return {
    actions: [prevButton, pageIndicator, nextButton],
  };
}
