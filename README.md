# Obsidian UI

Premium Discord app UI runtime framework. Build app-like Discord interfaces with screens, stateful flows, reusable components, and renderer abstraction.

**Version:** 0.2.0

---

## What It Is

Obsidian UI is a TypeScript framework for building structured, interactive Discord bot UIs. It provides:

- **Screen system** — define UI screens with render functions, action handlers, and lifecycle hooks
- **Renderer abstraction** — pluggable renderers (legacy embed-based, v2 Components) implement a shared interface
- **Interaction routing** — normalize slash commands, buttons, selects, and modals into a single action model
- **Session state** — scoped in-memory state (user/channel/guild/message) with TTL and cleanup
- **UI components** — 12 reusable primitives for common Discord UI patterns
- **Theme system** — token-based theming with presets

## v0.2 Changes from v0.1

- **Renderer separation** — rendering logic moved from adapter into renderer packages; adapter is now a thin dispatcher
- **Configurable state scope** — screens declare `stateScope` (user/channel/guild/message) instead of hardcoded user scope
- **Screen runtime** — `screenId` tracked on ActionContext; navigation no longer depends on fragile action ID parsing
- **8 new primitives** — Tabs, ActionBar, StatsGrid, EmptyState, LoadingState, ErrorState, SuccessState, SettingsPanel
- **Cleaner contracts** — proper `Renderer` interface, `RenderPayload` type, no duplicate type definitions

### Included
- Screen system with configurable state scopes and lifecycle
- Pluggable renderer architecture (legacy + v2)
- Interaction router (slash, button, select, modal)
- In-memory session state with scopes and TTL
- discord.js adapter
- 12 UI primitives
- 3 working example bots
- Theme system with presets

### Not Included
- Discord Activities implementation
- Visual builder / drag-and-drop editor
- Plugin marketplace
- Multi-adapter support
- Database persistence

## License

MIT
