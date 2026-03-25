import { createScreen, type ActionContext, type ScreenOutput, buildActionId } from '@obsidian-ui/core';
import { createPaginator, handlePaginatorAction } from '@obsidian-ui/components';
import { leaderboardData, formatEntry, type LeaderboardEntry } from '../data.js';

const PAGE_SIZE = 5;
const SCREEN_ID = 'leaderboard';

export const leaderboardScreen = createScreen({
  id: SCREEN_ID,

  onMount(ctx) {
    ctx.state.set('currentPage', 0);
  },

  render(ctx): ScreenOutput {
    const currentPage = ctx.state.get<number>('currentPage') ?? 0;

    const paginator = createPaginator<LeaderboardEntry>({
      items: leaderboardData,
      pageSize: PAGE_SIZE,
      screenId: SCREEN_ID,
      title: '🏆 Server Leaderboard',
      color: 0x1a1a2e,
      emptyMessage: 'No players on the leaderboard yet.',
      renderItem: (entry) => formatEntry(entry),
    }, currentPage);

    const refreshButton = {
      type: 'button' as const,
      id: buildActionId(SCREEN_ID, 'refresh'),
      label: '🔄 Refresh',
      style: 'primary' as const,
    };

    return {
      embeds: [paginator.embed],
      actionRows: [
        paginator.actionRow,
        { actions: [refreshButton] },
      ],
    };
  },

  actions: {
    page_prev(ctx) {
      handlePaginatorAction(ctx);
      ctx.refreshScreen();
    },
    page_next(ctx) {
      handlePaginatorAction(ctx);
      ctx.refreshScreen();
    },
    refresh(ctx) {
      ctx.refreshScreen();
    },
  },
});
