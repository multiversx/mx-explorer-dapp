const CONFIG = {
  /*
      Possbile flags:
        validators: (default) true
        economics: (default) false
        data: (default) false
        accessToken: (default) false
  */
  networks: [
    {
      id: 'mainnet',
      name: 'Mainnet',
      adapter: 'api',
      apiUrl: 'https://api.elrond.com',
      validatorDetails: true,
      erdLabel: 'EGLD',
      walletAddress: 'https://wallet.elrond.com/',
      explorerAddress: 'https://explorer.elrond.com/',
      theme: 'light',
      accessToken: true,
    },
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
