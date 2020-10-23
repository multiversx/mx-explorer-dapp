const CONFIG = {
  metaChainShardId: 4294967295,
  erdLabel: 'eGLD',
  elrondApps: [
    {
      id: 'main-site',
      name: 'Main site',
      to: 'https://elrond.com/',
    },
    {
      id: 'wallet',
      name: 'Wallet',
      to: 'https://wallet.elrond.com/',
    },
    {
      id: 'explorer',
      name: 'Explorer',
      to: 'https://explorer.elrond.com/',
    },
    {
      id: 'bridge',
      name: 'Bridge',
      to: 'https://bridge.elrond.com/',
    },
    {
      id: 'docs',
      name: 'Docs',
      to: 'https://docs.elrond.com/',
    },
  ],
  explorerApi: 'https://explorer-api.elrond.com',
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
