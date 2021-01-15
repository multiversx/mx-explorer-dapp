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
};

window.CONFIG = CONFIG;

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = CONFIG;
}
