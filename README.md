# MultiversX Explorer

![explorer.multiversx.com](https://github.com/multiversx/mx-explorer-dapp/blob/main/public/share.jpg)

This project was bootstrapped with [Vite](https://vitejs.dev/guide/).

## Deployments

[![deploy-devnet](https://github.com/multiversx/mx-explorer-dapp/actions/workflows/deploy-devnet.yml/badge.svg)](https://github.com/multiversx/mx-explorer-dapp/actions/workflows/deploy-devnet.yml)
[![deploy-testnet](https://github.com/multiversx/mx-explorer-dapp/actions/workflows/deploy-testnet.yml/badge.svg)](https://github.com/multiversx/mx-explorer-dapp/actions/workflows/deploy-testnet.yml)

## Requirements

- a `git` client installed
- `nodejs` (v18.19.0 LTS), `npm` and `yarn` installed
- optional, but useful: an IDE (Visual Code for example)

## Quick start

1. run `yarn` in the project directory.
2. run `npm run start-devnet` fot the `Devnet` network.
3. optionally make edits to `networks` or other configurations found in newly created `index.ts` in the `src/config` folder.

- One can use any of the existing network setups by running one of the `npm run start-*` scripts available in the `package.json` file.
- Or, alternatively copy one of the config files ( for ex. `/src/config/config.devnet.ts` ) to a new file `/src/config/index.ts`

## Available Scripts

In the project directory, you can run:

### `npm run start`

Runs the app in the development mode.
Open [http://localhost:3002](http://localhost:3002) to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

See the section about [deployment](https://vitejs.dev/guide/static-deploy.html#building-the-app) for more information.

### `npm run prepare-free-icons`

Use the Free version of the Fontawesome Icons ( used by default ) ( no paid plan necessary )

### `npm run prepare-pro-icons`

Prepare the Pro version of the Fontawesome Icons ( a paid plan for Fontawesome is needed )
If you already have a fontawesome accessToken, you will either have to either:

- set a `.npmrc` file with only the `_authToken`, without the `registry` ( the `.npmrc` file is already added in the `.gitignore` file)
- run `npm config set "//npm.fontawesome.com/:_authToken" FONT-AWESOME-PACKAGE-TOKEN`

See more on Fontawesome's [Using A Package Manager](https://fontawesome.com/docs/web/setup/packages) page.

## Learn More

You can learn more in the [Vite documentation](https://vitejs.dev/).

To learn React, check out the [React documentation](https://reactjs.org/).

## Roadmap

See the [open issues](https://github.com/multiversx/mx-explorer-dapp/issues) for a list of proposed features (and known issues).

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

One can contribute by creating _pull requests_, or by opening _issues_ for discovered bugs or desired features.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request to the `development` branch
