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
      id: 'mainnet',
      name: 'Mainnet',
      adapter: 'api',
      apiUrl: '***REMOVED***',
      validatorDetails: true,
      erdLabel: 'EGLD',
      walletAddress: '***REMOVED***/',
      explorerAddress: '***REMOVED***/',
      delegationApi: 'https://internal-delegation-api.multiversx.com',
      extrasApi: '***REMOVED***',
      growthApi: 'https://tools.multiversx.com/growth-api',
      theme: 'light',
      accessToken: false,
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
      name: 'Wallet',
      url: '***REMOVED***/',
    },
    {
      id: 'explorer',
      name: 'Explorer', // navbar title
      url: '***REMOVED***/',
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
