# TetherVault

TetherVault is a React Native self-custodial wallet demo built with Expo and
Tether WDK. The first version is intentionally scoped to a polished USDt wallet
experience that can be finished in one focused day while still showing serious
frontend and engineering judgment.

> Independent portfolio project using Tether WDK. This is not an official
> Tether product. Do not use with real funds until the WDK beta stack and this
> app have been production-audited.

## Day-One Scope

The demo target is one excellent wallet flow instead of many unfinished ones:

- Create or import a wallet.
- Protect access with an app password and local lock flow.
- Show the active wallet, account address, USD total, and USDt balance.
- Receive with address copy, share, and QR code.
- Send USDt on Ethereum Sepolia through the WDK EVM wallet package.
- Review transaction details before confirmation.
- Show transaction success, failure, and activity states cleanly.

See [`docs/DAY_ONE_PLAN.md`](docs/DAY_ONE_PLAN.md) for the locked build plan.

## Complete-Wallet Roadmap

The extension plan is documented separately so the demo can stay focused while
still showing how the product would become a complete wallet app.

See [`docs/COMPLETE_WALLET_ROADMAP.md`](docs/COMPLETE_WALLET_ROADMAP.md).

## Tech Stack

| Layer | Choice |
| --- | --- |
| Mobile framework | Expo SDK 55 + React Native |
| Navigation | Expo Router |
| Wallet SDK | `@tetherto/wdk-react-native-core` + `@tetherto/wdk` |
| Wallet runtime | WDK Bare-runtime worklet bundle |
| Wallet UI | `@tetherto/wdk-uikit-react-native` plus app-specific screens |
| Server state | TanStack Query |
| Local state | Zustand |
| Secure local storage | Expo SecureStore and WDK utility encryption |
| Language | TypeScript |

## Project Structure

The app keeps product concerns separated from wallet infrastructure:

```text
src/
  app/          Expo Router screens and route layouts
  components/   Shared app UI primitives
  data/         Data-source abstractions
  state/        Small Zustand stores
  theme/        Design tokens, palettes, and responsive helpers
  wdk/          WDK assets, networks, pricing, send, and wallet services
```

The original WDK starter documentation is still useful while the app is being
customized:

- [`docs/ENVIRONMENT.md`](docs/ENVIRONMENT.md)
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
- [`docs/WDK_INTEGRATION.md`](docs/WDK_INTEGRATION.md)
- [`docs/SECURITY.md`](docs/SECURITY.md)
- [`docs/TROUBLESHOOTING.md`](docs/TROUBLESHOOTING.md)

## Getting Started

Use Node 22 as specified by `.nvmrc`.

```bash
nvm use
npm install
cp .env.example .env
npx expo prebuild --clean
npm run ios
```

Environment notes:

- The app can boot without API keys.
- Balances and sending need the relevant provider, bundler, and paymaster URLs.
- Activity needs `EXPO_PUBLIC_WDK_INDEXER_API_KEY`.
- Cloud backup is future scope for the demo unless explicitly pulled forward.

## Repository

GitHub: <https://github.com/khalidsohaibrana/tethervault-wallet>
