# TetherVault Testnet Verification

Use this checklist to demo the wallet without risking production funds.

## Safe Networks

- Bitcoin is configured for Testnet by default: `EXPO_PUBLIC_BTC_PROVIDER=https://tbtc1.trezor.io/api` and WDK derives testnet `tb1...` addresses.
- Ethereum is configured for Sepolia by default: `EXPO_PUBLIC_EVM_ETHEREUM_PROVIDER=https://ethereum-sepolia-rpc.publicnode.com`.
- Arbitrum and Polygon entries are production networks in the default config. Treat them as read-only demo surfaces unless you replace their provider, token, bundler, paymaster, explorer, and indexer settings with testnet equivalents.

## Required Runtime Keys

- Sepolia sends require a real EIP-7702 bundler/paymaster URL in `EXPO_PUBLIC_EVM_ETHEREUM_BUNDLER_URL` and, when needed, `EXPO_PUBLIC_EVM_ETHEREUM_PAYMASTER_URL`.
- Activity requires `EXPO_PUBLIC_WDK_INDEXER_API_KEY`.
- Coin prices work without a key, but `EXPO_PUBLIC_COINGECKO_API_KEY` helps avoid rate limits.

## Manual Demo Flow

1. Create a new wallet.
2. Set a 6-digit PIN and enable Face ID / Touch ID if available.
3. Back up or reveal the recovery phrase only after the fresh biometric/PIN gate.
4. Open Receive, select Bitcoin Testnet or Ethereum Sepolia USDT, then copy/share the QR address.
5. Fund the address from a faucet or a controlled test wallet.
6. Confirm Home shows the updated balance.
7. Open the asset detail screen from Home and verify network safety labels, receive address, metadata, and recent activity.
8. Start Send, paste or scan the recipient address, enter a tiny test amount, review the fee, and confirm with biometrics/PIN.
9. Open the success receipt and explorer link.
10. Return to Activity and verify the transaction appears once the WDK Indexer has indexed it.

## Permission UX

- Camera permission is requested only when opening QR scan.
- If permission is denied but still requestable, the app shows an in-context Allow Camera action.
- If iOS/Android blocks further prompts, the app shows Open Settings.
- Send confirmation requires Face ID / Touch ID when enabled, with PIN fallback.
