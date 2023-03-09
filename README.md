# 💎 GemWallet Extension

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-5-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

## GemWallet: Crypto payments made easy

![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)
![license](https://img.shields.io/badge/license-file%20LICENSE-blue)
![npm version](https://img.shields.io/npm/v/@gemwallet/api)
![extension version](https://img.shields.io/github/package-json/v/GemWallet/gemwallet-extension?filename=%2Fpackages%2Fextension%2Fpackage.json)

## Introduction

GemWallet is a web extension that allows you to make online payments with one click on the XRPL. It also provides an API that bridges web browsers to the blockchain, allowing developers to easily build web3 applications integrated with XRP.

Our vision is really oriented toward payments, micro-payments, donations, and payment streaming.

![](demo.gif)

## Join the Discord of the community

Wanna help? You can raise an issue or send a pull request.

We also have a [Discord channel](https://discord.gg/CnkP9KGHBe), feel free to join it

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

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://www.linkedin.com/in/florianbouron/"><img src="https://avatars.githubusercontent.com/u/7243879?v=4?s=100" width="100px;" alt="Florian"/><br /><sub><b>Florian</b></sub></a><br /><a href="https://github.com/GemWallet/gemwallet-extension/commits?author=FlorianBouron" title="Code">💻</a> <a href="https://github.com/GemWallet/gemwallet-extension/commits?author=FlorianBouron" title="Documentation">📖</a> <a href="#maintenance-FlorianBouron" title="Maintenance">🚧</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/wojake"><img src="https://avatars.githubusercontent.com/u/87929946?v=4?s=100" width="100px;" alt="Wo Jake"/><br /><sub><b>Wo Jake</b></sub></a><br /><a href="#security-wojake" title="Security">🛡️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://www.wietse.com"><img src="https://avatars.githubusercontent.com/u/4756161?v=4?s=100" width="100px;" alt="Wietse Wind"/><br /><sub><b>Wietse Wind</b></sub></a><br /><a href="#security-WietseWind" title="Security">🛡️</a> <a href="#example-WietseWind" title="Examples">💡</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/mmaryo"><img src="https://avatars.githubusercontent.com/u/1669985?v=4?s=100" width="100px;" alt="Mario"/><br /><sub><b>Mario</b></sub></a><br /><a href="https://github.com/GemWallet/gemwallet-extension/commits?author=mmaryo" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/TusharPardhe"><img src="https://avatars.githubusercontent.com/u/31487192?v=4?s=100" width="100px;" alt="Tushar Pardhe"/><br /><sub><b>Tushar Pardhe</b></sub></a><br /><a href="https://github.com/GemWallet/gemwallet-extension/commits?author=TusharPardhe" title="Code">💻</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
