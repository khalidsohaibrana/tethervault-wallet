# Wallet Development Plan

This plan starts after the React Native shell is running locally. It keeps the
work ordered so every step leaves the app demoable.

## Branch Flow

- `main`: stable release branch.
- `development`: integration branch for completed setup and feature work.
- `feature/*`: focused implementation branches created from `development`.

Current feature branch:

```text
feature/tethervault-wallet-experience
```

## Milestone 1: Product Shell

Goal: make the inherited WDK starter feel like TetherVault.

- Replace starter-facing welcome and unlock branding.
- Keep legal/product language clear: independent demo using Tether WDK.
- Keep generated native output ignored; persist native fixes through Expo config.
- Verify app still boots on iPhone 16 Pro simulator.

## Milestone 2: Day-One Wallet Flow

Goal: one polished USDt wallet path.

- Onboarding: create wallet, import wallet, 6-digit PIN setup, optional biometrics.
- Wallet home: active account, total balance, USDt-first token list.
- Receive: Sepolia USDt address, QR, copy, share.
- Send: token select, address validation, amount entry, review, result.
- Activity: real indexer data when configured, clean fallback when not.

## Milestone 3: Security UX

Goal: make self-custody constraints obvious without scaring users.

- Seed reveal/import warnings.
- PIN rules and error states.
- Face ID/Touch ID unlock where the native OS supports it.
- Fresh PIN/biometric re-auth before seed reveal and transaction confirmation.
- Lock/unlock copy.
- No logging of secrets.
- Clear note that lost seed/PIN cannot be recovered by the app.

## Milestone 4: Demo Reliability

Goal: make the demo resilient under missing external services.

- Detect missing indexer key.
- Detect missing bundler/paymaster URLs.
- Show actionable fallback states.
- Keep receive/create/import usable without transaction history.
- Document faucet and test USDt requirements.

## Milestone 5: Complete Wallet Expansion

Goal: transition from demo to production candidate.

- Multi-account polish.
- Chain-by-chain expansion.
- Cloud backup restore.
- WalletConnect.
- Token allowances.
- Swap/on-ramp research.
- External security review.

## Engineering Rules

- Use Tether WDK for wallet primitives.
- Keep screens thin; put wallet mapping logic in `src/wdk`.
- Prefer feature-complete states over extra features.
- Use shared UI primitives for text, buttons, fields, and screens.
- Run `npm run typecheck` before every commit.
