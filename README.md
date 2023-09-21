# 💎 GemWallet Extension

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-15-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

## GemWallet: A crypto wallet & Web3 layer for the XRPL

![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)
[![license](https://img.shields.io/badge/license-file%20LICENSE-blue)](https://github.com/GemWallet/gemwallet-extension/blob/master/LICENSE)
[![Chrome Store users](https://img.shields.io/chrome-web-store/users/egebedonbdapoieedfcfkofloclfghab)](https://chrome.google.com/webstore/detail/gemwallet/egebedonbdapoieedfcfkofloclfghab)
[![Chrome Store rating](https://img.shields.io/chrome-web-store/rating/egebedonbdapoieedfcfkofloclfghab)](https://chrome.google.com/webstore/detail/gemwallet/egebedonbdapoieedfcfkofloclfghab)
![npm version](https://img.shields.io/npm/v/@gemwallet/api)
![extension version](https://img.shields.io/github/package-json/v/GemWallet/gemwallet-extension?filename=%2Fpackages%2Fextension%2Fpackage.json)
![Build Status](https://img.shields.io/github/actions/workflow/status/GemWallet/gemwallet-extension/integration.yml)
![Last commit](https://img.shields.io/github/last-commit/GemWallet/gemwallet-extension)

[![Chrome Store](https://img.shields.io/chrome-web-store/v/egebedonbdapoieedfcfkofloclfghab)](https://chrome.google.com/webstore/detail/gemwallet/egebedonbdapoieedfcfkofloclfghab)
[![Twitter](https://img.shields.io/twitter/follow/gemwallet_app?style=social)](https://twitter.com/gemwallet_app)
[![Discord](https://img.shields.io/discord/963846288263249971)](https://discord.gg/CnkP9KGHBe)
[![Youtube](https://img.shields.io/youtube/channel/subscribers/UCP980esJwyzU7qU4qZQ6A5Q?style=social)](https://www.youtube.com/channel/UCP980esJwyzU7qU4qZQ6A5Q)

## Useful links

- Download on the [Chrome Store](https://chrome.google.com/webstore/detail/gemwallet/egebedonbdapoieedfcfkofloclfghab)
- Visit the [official website](https://gemwallet.app)
- Visit the [documentation](https://gemwallet.app/docs/user-guide/introduction)
- Join us on [Discord](https://discord.gg/CnkP9KGHBe)
- Follow us on [Twitter](https://twitter.com/gemwallet_app)
- Watch our tutorials on [YouTube](https://www.youtube.com/channel/UCP980esJwyzU7qU4qZQ6A5Q)

## Introduction

GemWallet is a cutting-edge crypto wallet and Web3 layer for the XRP Ledger (XRPL). Our browser extension enables you to make fast and secure payments on the XRP Ledger directly from your browser. Say goodbye to the hassle of copying and pasting private keys, and join the revolution of effortless blockchain transactions with GemWallet. Experience the future of finance with us today.

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
      <td align="center" valign="top" width="14.28%"><a href="https://fr.linkedin.com/in/thibautbremand"><img src="https://avatars.githubusercontent.com/u/9871294?v=4?s=100" width="100px;" alt="Thibaut Bremand"/><br /><sub><b>Thibaut Bremand</b></sub></a><br /><a href="https://github.com/GemWallet/gemwallet-extension/commits?author=ThibautBremand" title="Code">💻</a> <a href="#infra-ThibautBremand" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/GemWallet/gemwallet-extension/commits?author=ThibautBremand" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/markibanez"><img src="https://avatars.githubusercontent.com/u/7534847?v=4?s=100" width="100px;" alt="Mark Ibanez"/><br /><sub><b>Mark Ibanez</b></sub></a><br /><a href="https://github.com/GemWallet/gemwallet-extension/issues?q=author%3Amarkibanez" title="Bug reports">🐛</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/florent-uzio"><img src="https://avatars.githubusercontent.com/u/36513774?v=4?s=100" width="100px;" alt="Florent"/><br /><sub><b>Florent</b></sub></a><br /><a href="https://github.com/GemWallet/gemwallet-extension/issues?q=author%3Aflorent-uzio" title="Bug reports">🐛</a> <a href="#ideas-florent-uzio" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/GemWallet/gemwallet-extension/commits?author=florent-uzio" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/benaor"><img src="https://avatars.githubusercontent.com/u/58249772?v=4?s=100" width="100px;" alt="Benjamin"/><br /><sub><b>Benjamin</b></sub></a><br /><a href="https://github.com/GemWallet/gemwallet-extension/commits?author=benaor" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/rikublock"><img src="https://avatars.githubusercontent.com/u/46352032?v=4?s=100" width="100px;" alt="Riku"/><br /><sub><b>Riku</b></sub></a><br /><a href="https://github.com/GemWallet/gemwallet-extension/issues?q=author%3Arikublock" title="Bug reports">🐛</a> <a href="#ideas-rikublock" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/GemWallet/gemwallet-extension/commits?author=rikublock" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/tfevre"><img src="https://avatars.githubusercontent.com/u/114390906?v=4?s=100" width="100px;" alt="tfevre"/><br /><sub><b>tfevre</b></sub></a><br /><a href="https://github.com/GemWallet/gemwallet-extension/issues?q=author%3Atfevre" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://www.linkedin.com/in/afolabisunday/"><img src="https://avatars.githubusercontent.com/u/31351334?v=4?s=100" width="100px;" alt="Afolabi Sunday"/><br /><sub><b>Afolabi Sunday</b></sub></a><br /><a href="#ideas-garantor" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/GemWallet/gemwallet-extension/issues?q=author%3Agarantor" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/qlemaire"><img src="https://avatars.githubusercontent.com/u/29045289?v=4?s=100" width="100px;" alt="Quentin Lemaire"/><br /><sub><b>Quentin Lemaire</b></sub></a><br /><a href="#security-qlemaire" title="Security">🛡️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/mworks-proj"><img src="https://avatars.githubusercontent.com/u/78353166?v=4?s=100" width="100px;" alt="meister"/><br /><sub><b>meister</b></sub></a><br /><a href="https://github.com/GemWallet/gemwallet-extension/commits?author=mworks-proj" title="Code">💻</a> <a href="#ideas-mworks-proj" title="Ideas, Planning, & Feedback">🤔</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Daviran"><img src="https://avatars.githubusercontent.com/u/77353097?v=4?s=100" width="100px;" alt="David Bugnon"/><br /><sub><b>David Bugnon</b></sub></a><br /><a href="#security-Daviran" title="Security">🛡️</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
