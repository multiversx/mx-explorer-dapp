const CONFIG = {
  /*
      Possbile flags:
        validators: (default) true
        economics: (default) false
        data: (default) false
  */
  networks: [
    {
      default: true,
      id: 'mainnet',
      name: 'Mainnet',
      adapter: 'api',
      apiUrl: 'https://api.elrond.com',
      data: true,
      validatorDetails: true,
      erdLabel: 'EGLD',
      walletAddress: 'https://wallet.elrond.com/',
      explorerAddress: 'https://explorer.elrond.com/',
      theme: 'default',
    },
    {
      id: 'testnet',
      name: 'Testnet',
      adapter: 'api',
      apiUrl: 'https://api-testnet.elrond.com',
      validatorDetails: true,
      erdLabel: 'XeGLD',
      walletAddress: 'https://testnet-wallet.elrond.com/',
      explorerAddress: 'https://testnet-explorer.elrond.com/',
      theme: 'testnet',
    },
  ],
};

window.CONFIG = CONFIG;

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = CONFIG;
}
