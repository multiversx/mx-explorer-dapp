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
      id: 'devnet',
      name: 'Devnet',
      adapter: 'api',
      apiUrl: 'https://devnet-api.multiversx.com',
      validatorDetails: true,
      erdLabel: 'XeGLD',
      walletAddress: 'https://devnet-wallet.multiversx.com/',
      explorerAddress: 'https://devnet-explorer.multiversx.com/',
      delegationApi: 'https://devnet-delegation-api.multiversx.com',
      extrasApi: 'https://devnet-extras-api.multiversx.com',
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
      name: 'Devnet Wallet',
      url: 'https://devnet-wallet.multiversx.com',
    },
    {
      id: 'explorer',
      name: 'Devnet Explorer', // navbar title
      url: 'http://devnet-explorer.multiversx.com',
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
