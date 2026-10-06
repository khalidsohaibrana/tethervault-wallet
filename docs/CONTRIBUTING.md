# Contributing

## Branch strategy

Three-tier structure:

- **`main`** — stable release branch. Don't commit directly here.
- **`development`** — the long-lived integration branch. Feature branches
  target this.
- **`feature/*`** — one branch per unit of work, branched off
  `development`.

Flow: `feature/*` -> PR into `development` -> `development` -> `main` when
the app is ready for a stable release.

## Before opening a PR

```bash
npm run typecheck
npm run lint
```

If your change touches native config (`app.json` plugins, new native
dependencies), note in your PR description that a `prebuild --clean` is
required — reviewers testing your branch need to know this isn't a
JS-only change.

## Conventions to follow

**Read `docs/ARCHITECTURE.md` first.** Several patterns in this codebase
exist specifically to avoid re-introducing bugs that were already found and
fixed — deviating from them without understanding why is how those bugs
come back.

- **Avoid importing WDK directly in screens for data reads.** Use
  `@/wdk/hooks/*` so network, asset, account, and indexer mapping stays in
  the wallet integration layer.
- **All text renders through `<Text>`, never raw React Native `<Text>`.**
  This is what applies responsive font scaling automatically. Same for
  `<Button>`, `<TextField>`, `<ScreenHeader>` — use the shared components,
  don't hand-roll pixel-based styling for things they already handle.
- **New pixel values should be `moderateScale()`'d**, not hardcoded, unless
  there's a specific reason not to (rare — document it in a comment if so).
- **Build screens from the product goal first.** Reuse the starter's working
  patterns, but make visible UI and copy fit TetherVault's one-day wallet
  demo.
- **Don't loosen a pinned dependency version without reading
  `docs/ENVIRONMENT.md` first.** Several exact pins exist because a caret
  range previously caused a real, hard-to-diagnose bug.
- **If you find a genuinely new bug/gotcha**, add it to
  `docs/TROUBLESHOOTING.md` in the same PR that fixes it. This file is only
  useful if it stays current.

## Testing changes to lock/session/cloud-backup code

These areas have caused subtle, platform-specific bugs before (see
`docs/SECURITY.md`, `docs/CLOUD_BACKUP.md`). If you touch
`AutoLockOnBackground.tsx`, `WdkSessionGate.tsx`, `passwordVault.ts`, or
`CloudBackupContext.tsx`, test on **both** iOS and Android before opening a
PR — several bugs here only reproduced on one platform.
