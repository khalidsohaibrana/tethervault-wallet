# TetherVault UI/UX Approval Artifact

Status: pending approval

## Product Goal

TetherVault should showcase polished frontend craft and real wallet engineering.
The first shipped demo should feel like a focused USDt mobile wallet, not a
generic crypto dashboard.

Primary demo promise:

> Create a self-custodial USDt wallet, protect it with PIN/biometrics, receive
> funds with QR, review a send, and see clear balance/activity states.

## Reference Wallet Patterns

The design direction borrows proven patterns from current wallet apps without
copying their visual identity:

- Trust Wallet: app lock, PIN/biometric protection, approval-management and
  transaction-authentication patterns.
- Coinbase Wallet: home-screen quick actions for send/receive/swap/funding and
  simple receive flows.
- Rainbow: mobile-first, friendly onboarding, strong visual hierarchy, and
  backup-first wallet creation.
- MetaMask Mobile: familiar wallet account, asset list, send/receive, browser
  and transaction confirmation mental model.

Design takeaway:

- Keep the home screen calm and useful.
- Put Send and Receive where the thumb expects them.
- Always show active network/asset context.
- Treat transaction review as a high-trust screen, not a formality.
- Use security gates for app open, seed reveal, and transaction signing.

## Visual Direction

TetherVault should feel:

- Secure, restrained, and high-signal.
- More fintech tool than crypto casino.
- USDt-forward, with Tether green as the trust/accent color.
- Native-mobile, not web page squeezed into a phone.

### Palette

Recommended palette:

| Role | Color | Usage |
| --- | --- | --- |
| Primary | `#26A17B` | Main CTA, active states, USDt identity |
| Primary pressed | `#1E8062` | Pressed CTA |
| Primary tint | `rgba(38,161,123,0.14)` | Icon badges, soft panels |
| Ink | `#101414` | Primary text |
| Muted ink | `rgba(16,20,20,0.62)` | Secondary text |
| Surface | `#FFFFFF` | Main background |
| Soft surface | `#F5FAF8` | Panels, rows, action buttons |
| Border | `#DDEAE5` | Dividers and inputs |
| Warning | `#F59E0B` | Risk and configuration warnings |
| Error | `#E5484D` | Invalid input and failed sends |

Avoid:

- Orange starter branding.
- Heavy purple/blue gradients.
- Decorative crypto-orb backgrounds.
- Over-carded dashboards.

## Information Architecture

Bottom tabs:

1. Wallet
2. Activity
3. Security

Secondary routes:

- Onboarding
- Create wallet
- Import wallet
- Backup phrase
- PIN setup
- Unlock
- Receive
- Send
- Review send
- Send result
- Transaction detail
- Settings

Day-one can keep Security/Settings lightweight, but it should exist to show
engineering maturity.

## Screen-by-Screen UX

### 1. Welcome

Purpose:

- Establish brand and trust.
- Offer create/import choices.
- Explain self-custody in one sentence.

Elements:

- TetherVault mark.
- Headline: `Your USDt vault, secured on device.`
- Supporting copy: `Create or import a self-custodial wallet powered by Tether WDK.`
- Primary CTA: `Create wallet`
- Secondary CTA: `Import wallet`
- Small footer: `Independent demo. Do not use with real funds.`

### 2. Create Wallet

Purpose:

- Generate wallet and introduce backup responsibility.

Flow:

1. Choose 12-word or 24-word phrase.
2. Show safety checklist before reveal.
3. Reveal phrase.
4. Confirm phrase.
5. Create PIN.
6. Offer biometric unlock.

Expected states:

- Loading wallet generation.
- Wallet creation failure.
- User-cancelled biometric enrollment.

### 3. Import Wallet

Purpose:

- Restore a wallet from seed phrase.

Elements:

- 12/24 word segmented control.
- Paste handling.
- Validation before continue.
- Warning that seed phrase is never sent to a server.

### 4. PIN And Biometric Setup

Purpose:

- Create local app access control before wallet home.

Recommended model:

- Require a 6-digit PIN for app unlock.
- Store a verifier/encrypted key material in OS secure storage.
- Let Face ID/Touch ID unlock the locally encrypted app session after PIN setup.
- Require PIN fallback if biometric changes, fails, or is unavailable.
- Gate seed reveal and send confirmation with biometric/PIN re-auth.

Screen sequence:

1. Create PIN.
2. Confirm PIN.
3. Enable Face ID/Touch ID.
4. Recovery reminder.

### 5. Unlock

Purpose:

- Fast secure return to wallet.

Elements:

- TetherVault mark.
- PIN keypad.
- Face ID button when available.
- `Use PIN instead` fallback.
- Lockout after repeated failed attempts.

### 6. Wallet Home

Purpose:

- Let user understand holdings and act quickly.

Layout:

- Header: active account, network badge, security icon.
- Balance block: total USD value.
- Primary asset card: USDt balance.
- Quick actions: Send, Receive.
- Secondary actions: Activity, Security.
- Token list below.

Day-one focus:

- USDt first.
- Sepolia badge visible.
- Clear empty state if balance fetch cannot run.

### 7. Receive

Purpose:

- Share address safely.

Elements:

- Asset selector locked/defaulted to USDt.
- Network badge: `Ethereum Sepolia`.
- QR code.
- Address with copy button.
- Share button.
- Warning: `Only receive supported assets on this network.`

### 8. Send

Purpose:

- Enter recipient and amount with confidence.

Steps:

1. Select asset/network.
2. Recipient address.
3. Amount.
4. Review.
5. Authenticate.
6. Broadcast.
7. Result.

Validation:

- Required recipient.
- Chain-aware address validation.
- Required amount.
- Amount <= available balance.
- Missing bundler/paymaster configuration.
- Network unavailable.

### 9. Review Send

Purpose:

- Prevent accidental or unclear sends.

Show:

- Amount.
- Asset.
- Recipient.
- Network.
- Estimated fee or gas sponsorship status.
- Warnings.
- Final CTA: `Confirm and send`.

Require:

- PIN or biometric re-auth before signing/broadcast.

### 10. Activity

Purpose:

- Show wallet history or explain why history is unavailable.

States:

- Loading.
- Empty.
- Missing WDK Indexer key.
- Real transaction list.
- Failed fetch with retry.

### 11. Security

Purpose:

- Demonstrate security engineering clearly.

Items:

- App lock: enabled.
- Face ID/Touch ID: enabled/disabled.
- Reveal recovery phrase.
- Backup status.
- Auto-lock timeout.
- Developer/demo safety notice.

## Native Security Model

### App Access

- Use a 6-digit PIN as the required local credential.
- Use OS biometrics through native APIs as convenience authentication.
- Never treat biometrics as recovery.
- Fall back to PIN after biometric failure or device biometric set changes.
- Auto-lock on app background.
- Require re-auth for sensitive actions:
  - seed reveal
  - send confirmation
  - backup export/restore
  - wallet deletion

### Storage

- Wallet keys remain under WDK secure storage.
- App PIN verifier/session material uses OS secure storage.
- No seed phrase or private key in logs, analytics, screenshots, or crash reports.
- Clipboard address copy should be explicit; seed phrase should not be copied by
  default.

### UX Best Practices

- Explain self-custody without long legal copy.
- Prefer short warnings at the moment of risk.
- Use confirmation screens for irreversible actions.
- Use clear failure messages, not raw SDK errors.

## Day-One Implementation Order

1. Finalize visual theme to TetherVault green.
2. Replace remaining starter branding.
3. Add Security tab shell.
4. Add PIN setup screen.
5. Add biometric availability check.
6. Gate unlock with PIN/biometric.
7. Gate seed reveal and send confirmation.
8. Polish Wallet home.
9. Polish Receive flow.
10. Polish Send and Review flow.
11. Polish Activity fallback states.
12. Verify end-to-end on iPhone 16 Pro simulator.

## Approval Questions

Please approve or revise:

1. Brand direction: Tether green, restrained fintech style.
2. Navigation: Wallet, Activity, Security tabs.
3. Security model: required PIN plus optional Face ID/Touch ID.
4. Day-one scope: USDt-first, Sepolia-first, no swaps/on-ramp yet.
5. Tone: independent demo, not official Tether product.

## Approved Scope Placeholder

Approval status:

```text
Pending
```
