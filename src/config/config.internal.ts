const CONFIG = {
  /*
        Possible flags:
          links: (default) []
        Possbile network flags:
          validators: (default) true
          economics: (default) false
          data: (default) false
    */
  networks: [
    {
      default: true,
      id: 'testnet',
      name: 'Testnet',
      adapter: 'api',
      apiUrl: 'https://testnet-api.multiversx.com',
      validatorDetails: true,
      walletAddress: 'https://testnet-wallet.multiversx.com/',
      explorerAddress: 'https://testnet-explorer.multiversx.com/',
      delegationApi: 'https://testnet-delegation-api.multiversx.com',
      extrasApi: 'https://testnet-extras-api.multiversx.com',
      growthApi: 'https://tools.multiversx.com/growth-api',
      erdLabel: 'XeGLD',
      theme: 'testnet',
    },
    // Testnets
    {
      id: 'testnet-azure-all-in-one-maiar',
      name: 'Maiar API All-In-One Testnet',
      adapter: 'elastic',
      proxyUrl: 'https://proxy-maiar.multiversx.com',
      elasticUrl: 'https://elastic-maiar.multiversx.com',
      erdLabel: 'XeGLD',
      theme: 'testnet',
    },
    {
      id: 'testnet-cp-test01',
      name: 'ClusterPower Testnet 01',
      adapter: 'api',
      apiUrl: '***REMOVED***',
      delegationApi: 'https://testnet-delegation-api.multiversx.com/',
      erdLabel: 'XeGLD',
      theme: 'testnet',
    },
    {
      id: 'testnet-do-ams',
      name: 'DigitalOcean Amsterdam Testnet',
      adapter: 'api',
      apiUrl: '***REMOVED***',
      delegationApi: 'https://testnet-delegation-api.multiversx.com/',
      erdLabel: 'XeGLD',
      theme: 'testnet',
    },
    {
      id: 'testnet-upcloud-fra',
      name: 'Upcloud Frankfurt Testnet',
      adapter: 'api',
      apiUrl: '***REMOVED***',
      delegationApi: 'https://testnet-delegation-api.multiversx.com/',
      erdLabel: 'XeGLD',
      theme: 'testnet',
    },
    {
      id: 'testnet-do-lon',
      name: 'DigitalOcean London Testnet',
      adapter: 'api',
      apiUrl: '***REMOVED***',
      delegationApi: 'https://testnet-delegation-api.multiversx.com/',
      erdLabel: 'XeGLD',
      theme: 'testnet',
    },
    {
      id: 'testnet-upcloud-mad',
      name: 'Upcloud Madrid Testnet',
      adapter: 'api',
      apiUrl: '***REMOVED***',
      delegationApi: 'https://testnet-delegation-api.multiversx.com/',
      erdLabel: 'XeGLD',
      theme: 'testnet',
    },
    {
      id: 'testnet-do-multi',
      name: 'DigitalOcean MULTI Testnet',
      adapter: 'api',
      apiUrl: '***REMOVED***',
      delegationApi: 'https://testnet-delegation-api.multiversx.com/',
      erdLabel: 'XeGLD',
      theme: 'testnet',
    },
    {
      id: 'testnet-do-shadowfork-four',
      name: 'SHADOWFORK 4 Testnet',
      adapter: 'api',
      apiUrl: '***REMOVED***',
      delegationApi: 'https://testnet-delegation-api.multiversx.com/',
      erdLabel: 'XeGLD',
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
      name: 'Internal Wallet',
      url: '***REMOVED***/',
    },
    {
      id: 'explorer',
      name: 'Internal Explorer', // navbar title
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
