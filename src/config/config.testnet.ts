const CONFIG = {
  /*
        Possible flags:
          links: (default) []
        Possbile network flags:
          validators: (default) true
          economics: (default) false
          data: (default) false
    */
  links: [
    {
      id: 'mainnet',
      name: 'Mainnet',
      url: 'https://explorer.multiversx.com/',
    },
    {
      id: 'testnet',
      name: 'Testnet',
      url: 'https://testnet-explorer.multiversx.com/',
    },
    {
      id: 'devnet',
      name: 'Devnet',
      url: 'https://devnet-explorer.multiversx.com/',
    },
  ],
  networks: [
    {
      default: true,
      id: 'testnet',
      name: 'Testnet',
      adapter: 'api',
      apiUrl: 'https://testnet-api.multiversx.com',
      validatorDetails: true,
      erdLabel: 'XeGLD',
      walletAddress: 'https://testnet-wallet.multiversx.com/',
      explorerAddress: 'https://testnet-explorer.multiversx.com/',
      delegationApi: 'https://testnet-delegation-api.multiversx.com',
      extrasApi: 'https://testnet-extras-api.multiversx.com',
      growthApi: 'https://tools.multiversx.com/growth-api',
      theme: 'testnet',
    },
  ],
  multiversXApps: [
    {
      id: 'main-site',
      name: 'MultiversX',
      url: 'https://multiversx.com/',
    },
    {
      id: 'wallet',
      name: 'Testnet Wallet',
      url: 'https://testnet-wallet.multiversx.com/',
    },
    {
      id: 'explorer',
      name: 'Testnet Explorer', // navbar title
      url: 'https://testnet-explorer.multiversx.com/',
    },
    {
      id: 'xexchange',
      name: 'xExchange',
      url: 'https://xexchange.com/',
    },
    {
      id: 'xlaunchpad',
      name: 'xLaunchpad',
      url: 'https://xlaunchpad.com/',
    },
    {
      id: 'bridge',
      name: 'Bridge',
      url: 'https://ad-astra.multiversx.com/',
    },
    {
      id: 'docs',
      name: 'Docs',
      url: 'https://docs.multiversx.com/',
    },
  ],
};

window.CONFIG = CONFIG;

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = CONFIG;
}
