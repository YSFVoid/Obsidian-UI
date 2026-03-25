# Obsidian UI

Premium Discord app UI runtime framework. Build app-like Discord interfaces with screens, stateful flows, reusable components, and renderer abstraction.

**Version:** 0.1.0 (Foundation Release)

---

## What It Is

Obsidian UI is a TypeScript framework for building structured, interactive Discord bot UIs. It provides:

- **Screen system** — define UI screens with render functions, action handlers, and lifecycle hooks
- **Interaction routing** — normalize slash commands, buttons, selects, and modals into a single action model
- **Session state** — in-memory scoped state with TTL and cleanup
- **Renderer abstraction** — legacy embed-based renderer + v2 renderer contract for future surfaces
- **UI components** — Card, Paginator, ConfirmDialog, and Wizard primitives
- **Theme system** — token-based theming with presets

## Repo Structure

```
obsidian-ui/
├── packages/
│   ├── core/                  # Framework contracts, screen/action/session models
│   ├── discord-adapter/       # discord.js integration layer
│   ├── renderer-legacy/       # Embed-based renderer
│   ├── renderer-v2/           # Future surface renderer (v0.1 stub)
│   ├── components/            # Card, Paginator, ConfirmDialog, Wizard
│   └── themes/                # Theme tokens and presets
├── examples/
│   ├── leaderboard-bot/       # Paginated leaderboard with Cards
│   └── setup-wizard-bot/      # Multi-step wizard with modals and confirm
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
└── .env.example
```

## Packages

| Package | Description |
|---------|-------------|
| `@obsidian-ui/core` | Screen definitions, action contracts, session store, lifecycle hooks, app factory |
| `@obsidian-ui/discord-adapter` | Normalize discord.js interactions → framework actions, response handling |
| `@obsidian-ui/renderer-legacy` | Convert screen output to Discord embeds + action rows |
| `@obsidian-ui/renderer-v2` | Future renderer contract for Components V2 / Activities |
| `@obsidian-ui/components` | Card, Paginator, ConfirmDialog, Wizard UI primitives |
| `@obsidian-ui/themes` | Theme tokens, `defineTheme` factory, obsidian/neon presets |

## Core API

```typescript
import { createObsidianApp, createScreen } from '@obsidian-ui/core';
import { createDiscordAdapter } from '@obsidian-ui/discord-adapter';
import { createPaginator, createConfirmDialog } from '@obsidian-ui/components';
import { obsidianTheme } from '@obsidian-ui/themes';

const screen = createScreen({
  id: 'myscreen',
  render(ctx) {
    return {
      embeds: [{ title: 'Hello', description: 'World' }],
      actionRows: [],
    };
  },
  actions: {
    myAction(ctx) {
      ctx.state.set('key', 'value');
      ctx.refreshScreen();
    },
  },
});

const app = createObsidianApp({
  theme: obsidianTheme,
  screens: [screen],
});
```

### ActionContext API

| Method | Description |
|--------|-------------|
| `ctx.state.get(key)` | Read session state |
| `ctx.state.set(key, value)` | Write session state |
| `ctx.state.has(key)` | Check state key exists |
| `ctx.state.delete(key)` | Remove state key |
| `ctx.openScreen(id, params?)` | Navigate to a screen |
| `ctx.refreshScreen()` | Re-render current screen |
| `ctx.closeScreen()` | Remove screen output |
| `ctx.showModal(modal)` | Display a modal |
| `ctx.respond(output, mode?)` | Send response (reply/update/followup/ephemeral/public) |

## Scripts

```bash
pnpm install          # Install all dependencies
pnpm build            # Build all packages
pnpm test             # Run all tests
pnpm dev              # Watch mode for all packages
```

### Running Examples

```bash
cp .env.example .env  # Fill in your bot credentials
pnpm --filter leaderboard-bot dev
pnpm --filter setup-wizard-bot dev
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DISCORD_TOKEN` | Bot token from Discord Developer Portal |
| `DISCORD_CLIENT_ID` | Application client ID |
| `DISCORD_GUILD_ID` | Guild ID for command registration |

## v0.1 Scope

### Included
- Screen system with render + action handlers + lifecycle
- Interaction router (slash, button, select, modal)
- In-memory session state with scopes and TTL
- discord.js adapter
- Legacy embed-based renderer
- V2 renderer contract (stub)
- Theme system with obsidian and neon presets
- Card, Paginator, ConfirmDialog, Wizard components
- Leaderboard and Setup Wizard example bots

### Not Included
- Discord Activities implementation
- Visual builder / drag-and-drop editor
- Plugin marketplace
- Multi-adapter support
- Database persistence
- Auth dashboard
- Business logic (economy, moderation, music)

## License

MIT
