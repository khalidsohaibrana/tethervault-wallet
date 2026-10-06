# TetherVault Day-One Plan

## Objective

Build a portfolio-ready React Native wallet demo in one day using Tether WDK.
The app should feel like a real self-custodial USDt wallet, not a static
prototype.

## Product Positioning

TetherVault is an independent mobile wallet demo focused on USDt self-custody.
It showcases frontend product polish, secure wallet thinking, clean React Native
architecture, and the ability to integrate a real wallet SDK under time
pressure.

## Scope Lock

Day one is limited to:

- React Native app booting locally on iOS first.
- Wallet create and import flows.
- Password setup, lock, and unlock.
- One primary wallet identity.
- Ethereum Sepolia as the first execution network.
- USDt as the hero asset.
- Receive screen with address, copy, share, and QR code.
- Send flow with recipient, amount, review, confirmation, and result.
- Balance and activity states using WDK services where available.
- Clear fallback states when an external API key or faucet is missing.

Out of scope for day one:

- Production mainnet usage.
- Multi-chain polish beyond what already exists in the starter.
- Swaps, bridges, fiat ramps, NFTs, DeFi, or card features.
- Hardware wallets.
- Cloud-backup restore.
- Full App Store or Play Store release.

## Day-One Schedule

### Hour 1: Foundation

- Confirm repo identity and app naming.
- Install dependencies.
- Validate Node/npm versions.
- Confirm WDK worklet generation.
- Create `.env` from `.env.example`.

### Hours 2-3: Product Scope Pass

- Trim visible copy to TetherVault.
- Keep the starter's wallet architecture intact.
- Make onboarding, lock, wallet, receive, send, and activity routes easy to
  demo.
- Document known external-service dependencies.

### Hours 4-5: Wallet Dashboard

- Confirm wallet creation and unlock.
- Confirm active account display.
- Confirm USDt balance UI and empty/error/loading states.
- Improve receive entry point.

### Hours 6-7: Send Flow

- Confirm USDt asset selection.
- Confirm recipient validation.
- Confirm amount entry and review screen.
- Confirm send result handling.
- Add plain-language transaction risk copy where needed.

### Hours 8-9: UI Polish

- Use WDK UI kit pieces where they reduce time and improve consistency.
- Keep spacing, typography, and state views consistent.
- Tighten copy for demo clarity.
- Avoid adding large new abstractions unless they reduce real complexity.

### Hours 10-11: Engineering Polish

- Run typecheck and lint.
- Fix any broken imports or app identity issues.
- Keep feature boundaries clear.
- Add README and roadmap docs.

### Hour 12: Demo Prep

- Prepare happy-path demo script.
- Capture screenshots if the app runs.
- Note any external dependencies not configured locally.
- Push the initial repo state to GitHub.

## Demo Success Criteria

The demo is successful when:

- The app opens as TetherVault.
- A user can create or import a wallet.
- A user can lock and unlock the wallet.
- The dashboard shows the wallet address and balance state.
- A user can receive with QR/copy/share.
- A user can prepare and review a USDt send.
- A successful send works on Sepolia when the required provider/faucet setup is
  available.
- The repo is organized, typed, documented, and explainable in an interview.

## Risk Register

| Risk | Mitigation |
| --- | --- |
| WDK beta or native build friction | Start from the official React Native starter and preserve working structure. |
| Missing bundler/paymaster key | Keep send flow UI complete and document exact env requirement. |
| Indexer key unavailable | Show clean empty state and keep dashboard/receive/send demo usable. |
| Faucet/test USDt unavailable | Demo receive and transaction preparation; document live-send dependency. |
| Too much scope | Keep day-one scope locked to Sepolia USDt and one polished path. |
