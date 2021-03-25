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
      url: 'https://explorer.elrond.com/',
    },
    {
      id: 'testnet',
      name: 'Testnet',
      url: 'https://testnet-explorer.elrond.com/',
    },
    {
      id: 'devnet',
      name: 'Devnet',
      url: 'https://devnet-explorer.elrond.com/',
    },
  ],
  networks: [
    {
      default: true,
      id: 'mainnet',
      name: 'Mainnet',
      adapter: 'api',
      apiUrl: 'https://beta-api.elrond.com',
      validatorDetails: true,
      erdLabel: 'EGLD',
      walletAddress: 'https://wallet.elrond.com/',
      explorerAddress: 'https://explorer.elrond.com/',
      theme: 'light',
      accessToken: true,
    },
  ],
  elrondApps: [
    {
      id: 'main-site',
      name: 'Main site',
      url: 'https://elrond.com/',
    },
    {
      id: 'wallet',
      name: 'Wallet',
      url: 'https://wallet.elrond.com/',
    },
    {
      id: 'explorer',
      name: 'Explorer', // navbar title
      url: 'https://explorer.elrond.com/',
    },
    {
      id: 'bridge',
      name: 'Bridge',
      url: 'https://bridge.elrond.com/',
    },
    {
      id: 'docs',
      name: 'Docs',
      url: 'https://docs.elrond.com/',
    },
    {
      id: 'growth',
      name: 'Growth',
      url: 'https://growth.elrond.com/',
    },
    {
      id: 'maiar',
      name: 'Maiar',
      url: 'https://maiar.com/',
    },
  ],
};

window.CONFIG = CONFIG;

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = CONFIG;
}
