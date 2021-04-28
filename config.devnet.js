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
      id: 'devnet',
      name: 'Devnet',
      adapter: 'api',
      apiUrl: 'https://devnet-api.elrond.com',
      validatorDetails: true,
      erdLabel: 'XeGLD',
      walletAddress: 'https://devnet-wallet.elrond.com/',
      explorerAddress: 'https://devnet-explorer.elrond.com/',
      theme: 'testnet',
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
      name: 'Devnet Wallet',
      url: 'https://devnet-wallet.elrond.com',
    },
    {
      id: 'explorer',
      name: 'Devnet Explorer', // navbar title
      url: 'http://devnet-explorer.elrond.com',
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
    {
      id: 'maiar',
      name: 'Maiar Exchange',
      url: 'https://maiar.exchange/',
    },
  ],
};

window.CONFIG = CONFIG;

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = CONFIG;
}
