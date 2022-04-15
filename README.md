# 💎 GemWallet Extension

## GemWallet: Crypto payments made easy

![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)
![license](https://img.shields.io/badge/license-file%20LICENSE-blue)
![npm version](https://img.shields.io/npm/v/@gemwallet/api)

## Introduction

GemWallet is a web extension that allows you to make online payments with one click on the XRPL. It also provides an API that bridges web browsers to the blockchain, allowing developers to easily build web3 applications integrated with XRP.

Our vision is really oriented toward payments, micro-payments, donations, and payment streaming.

![](demo.gif)

## Getting Started

First, run husky:

```bash
npm run prepare
```

Then, give the proper rights to the githooks:

```bash
chmod +x .husky/*
```

## Available Scripts

This repository is using `yarn workspaces` to handle the monorepo. Please to use the yarn when indicated bellow.

In the project directory, you can run:

### `yarn build`

Builds the extension GemWallet for production to the `packages/extension/build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

### `yarn build:api:cdn`

Builds the GemWallet's API for a CDN delivery in the `dist` folder.

### `yarn build:api:npm`

Builds the GemWallet's API for an NPM delivery in the `package/api/dist` folder.

### `yarn lint`

Lint all the packages in the repo.

### `yarn prepare`

Prepare the repository to accept Husky, useful for development.

### `yarn prettier`

Prettify JavaScript (.js) and TypeScript (.ts, .tsx) files.

### `npm run release:api:npm`

Release the API package on the npm registry. Before doing the release make sure that the version of the API is the correct one in the file: `packages/api/package.json`.

### `yarn start`

Runs the extension in the development mode.
Open http://localhost:3000 to view it in the browser.

### `yarn start:api`

Runs the API in the development mode.
Open http://localhost:8080 to view it in the browser.

### `yarn test`

Run unit tests for all the packages of the repository.

## License

GemWallet is open source software licensed under the file [LICENSE](LICENSE) in that repository.
