# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

GemWallet is a browser extension (Chrome, Manifest v3) for the XRP Ledger. It is structured as a Yarn monorepo with 5 packages under `/packages/`.

## Packages

| Package                      | Description                                                                |
| ---------------------------- | -------------------------------------------------------------------------- |
| `@gemwallet/extension`       | Main browser extension (React + Vite)                                      |
| `@gemwallet/api`             | dApp SDK — injected into web pages via content script (Webpack, UMD + ESM) |
| `@gemwallet/constants`       | Shared TypeScript types and constants used across packages                 |
| `@gemwallet/eslint-config`   | Shared ESLint config                                                       |
| `@gemwallet/prettier-config` | Shared Prettier config                                                     |

## Commands

All commands run from the repo root unless noted otherwise.

```bash
# Development
yarn start           # Run extension in dev mode (port 3000)
yarn start:api       # Run API dev server (port 8080)

# Build
yarn build           # Build the browser extension
yarn build:api:cdn   # Build API as UMD bundle for CDN
yarn build:api:npm   # Build API for npm distribution

# Testing
yarn test            # Run all unit tests (Vitest for extension, Jest for api)
yarn cypress         # Open Cypress E2E test runner

# Code quality (run automatically on commit via Husky)
yarn lint            # ESLint with auto-fix
yarn prettier        # Format all JS/TS/TSX/JSON/MD files
```

### Running a single test file

```bash
# From packages/extension
yarn vitest run src/utils/yourFile.test.ts

# From packages/api
yarn jest src/yourFile.test.ts
```

All tests must run with `TZ=UTC` (already set in the root `yarn test` script).

## Extension Architecture

### Chrome Extension Layers

The extension has four distinct execution contexts, each with its own entry point:

- **Popup** (`src/index.tsx` → `src/App.tsx`) — the React UI shown when the user clicks the extension icon
- **Background** (`src/chromeServices/background/`) — service worker; manages wallet state, handles messages from content scripts
- **Content Script** (`src/chromeServices/content/`) — injected into every page; bridges the page ↔ background communication
- **Offscreen Document** (`src/chromeServices/offscreen/`) — runs in an offscreen document for tasks that require a DOM outside the service worker

### State Management

Global state is managed via React Contexts in `src/contexts/`:

- `WalletContext` — wallet accounts and seed
- `NetworkContext` — current network / websocket connection
- `LedgerContext` — XRPL ledger interaction helpers
- `BrowserContext` — Chrome storage and messaging utilities

### Component Organization (Atomic Design)

```
src/components/
  atoms/       # Primitive UI elements
  molecules/   # Composed atoms
  organisms/   # Complex sections
  pages/       # Full page views
  templates/   # Page layout wrappers
```

### Utils

`src/utils/` contains 55+ domain-specific subdirectories (e.g., `parseFromXRPL`, `NFT`, `trustlines`). When adding new utility logic, place it in the relevant subdirectory or create a new one.

## API Package Architecture

The `@gemwallet/api` package exposes methods (e.g., `sendPayment`, `signTransaction`, `mintNFT`) that dApps call on the `window.gemwallet` object. At runtime, these calls are forwarded by the content script to the background service worker and back. The package is built twice: once as a UMD bundle for CDN distribution and once as an ESM package for npm.

## Key Dependencies

- **xrpl 3.x** — XRPL JavaScript library (core ledger interaction)
- **xrpl-accountlib** — key/account management
- **React 18 + React Router v6** — UI
- **MUI 6** — component library
- **Vite 5** — extension bundler
- **Webpack** — API bundler

## Code Quality

- Pre-commit hooks (Husky + lint-staged) automatically run Prettier and ESLint on staged files.
- ESLint config is in `@gemwallet/eslint-config`; rules target `.ts` and `.tsx` files.
- Prettier config is in `@gemwallet/prettier-config`.
- Node >= 20.11.1 required; use `.nvmrc` to pin the version.
