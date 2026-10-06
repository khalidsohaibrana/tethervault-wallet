# Complete Wallet Roadmap

This roadmap explains how TetherVault grows from a one-day USDt demo into a
complete wallet solution.

## Phase 1: Demo-Ready Wallet

Goal: prove the core self-custodial wallet experience.

- Create/import wallet.
- PIN-based lock and unlock with optional native biometrics.
- Ethereum Sepolia USDt balance.
- Receive with QR and copy/share.
- Send USDt with review and result screens.
- Activity states through WDK Indexer where configured.
- Clear security disclaimers and no real-funds positioning.

## Phase 2: Production Wallet Foundation

Goal: harden the app for real users.

- Replace demo identifiers with production bundle IDs and store metadata.
- Complete threat model and wallet data-flow documentation.
- Add biometric/PIN freshness policies for sensitive wallet actions.
- Add stricter seed phrase reveal/import controls and recovery phrase verification.
- Add analytics that never records addresses, seeds, private keys, or sensitive
  transaction payloads.
- Add crash reporting with wallet-data redaction.
- Add CI for lint, typecheck, tests, and build checks.
- Add release channels for development, staging, and production.

## Phase 3: Better Wallet UX

Goal: make the app useful beyond a demo.

- Multi-account management.
- Account labels and address book.
- Transaction history with filters and explorer links.
- Improved fee display.
- Pending transaction tracking.
- Push/local notifications for transaction status.
- Token details screens.
- Portfolio total with fiat conversion.
- Better empty, loading, and degraded-service states.

## Phase 4: Multi-Network Wallet

Goal: expand carefully without confusing users.

- Keep USDt as the primary asset.
- Add supported WDK networks one at a time.
- Start with chains already present in the WDK starter configuration.
- Add network-specific receive warnings.
- Add chain-aware address validation.
- Add network availability checks.
- Hide network/asset combinations that cannot actually be sent or indexed.

## Phase 5: Backup And Recovery

Goal: reduce permanent-loss risk without compromising custody.

- Finish encrypted cloud-backup restore.
- Support iCloud and Google Drive restore flows.
- Add backup health status.
- Add recovery phrase verification.
- Add explicit lost-password and lost-seed education.
- Add migration tests for encrypted local wallet data.

## Phase 6: Advanced Wallet Features

Goal: move from wallet demo to wallet platform.

- WalletConnect.
- DApp connection permissions.
- Message signing review screens.
- Token allowance review and revoke flow.
- Swap integration.
- Fiat on-ramp/off-ramp exploration.
- Contacts and payment links.
- Optional smart-account policies where WDK support is mature.

## Phase 7: Production Security

Goal: prepare for real-funds review.

- External security audit.
- Dependency and supply-chain audit.
- Reproducible build strategy.
- Runtime jailbreak/root risk handling.
- Secure clipboard timeout.
- App background privacy screen.
- Phishing-resistant transaction simulation where available.
- Formal incident response and key-compromise playbooks.

## Architecture Principles

- Use WDK for wallet primitives; do not hand-roll cryptography.
- Keep network, asset, pricing, and indexer logic inside `src/wdk`.
- Keep route screens thin and push repeated state/formatting into hooks or
  small helpers.
- Keep security UX explicit, boring, and predictable.
- Prefer one reliable chain/asset experience over many fragile integrations.

## Interview Story

TetherVault should communicate:

- I can integrate a real wallet SDK under time constraints.
- I understand self-custody and key-management risk.
- I can structure a React Native app so it can grow.
- I know when to use existing infrastructure instead of inventing brittle
  crypto logic.
- I can ship a polished scope and document what comes next.
