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
      id: 'bridge',
      name: 'Bridge',
      to: 'https://bridge.elrond.com/',
    },
    {
      id: 'staking',
      name: 'Staking',
      to: 'https://genesis.elrond.com',
    },
    {
      id: 'pre-staking',
      name: 'Pre-staking',
      to: 'https://stake.elrond.com',
    },
    {
      id: 'explorer',
      name: 'Explorer',
      to: 'https://explorer.elrond.com/',
    },
    {
      id: 'docs',
      name: 'Docs',
      to: 'https://docs.elrond.com/',
    },
  ],
  explorerApi: 'https://explorer-api.elrond.com',
  /*
      Legend:
        decimals: number of displayed ERD decimals in explorer
        denomination: number by which transaction are divided
        numInitCharactersForScAddress: number of zeros to hide
      Possbile flags:
        validators: (default) true
        validatorDetails: (default) false
        economics: (default) false
        data: (default) false
        wallet: (default) true
        faucet: (default) false (faucet)
    */
  networks: [
    {
      default: true,
      id: 'mainnet',
      name: 'Mainnet',
      adapter: 'api',
      apiUrl: 'https://api.elrond.com',
      numInitCharactersForScAddress: 14,
      gasLimitEditable: true,
      data: true,
      validatorDetails: true,
      faucet: false,
    },
    {
      id: 'testnet',
      name: 'Testnet',
      adapter: 'api',
      apiUrl: 'https://api-testnet.elrond.com',
      numInitCharactersForScAddress: 14,
      validatorDetails: true,
    },
    {
      default: false,
      id: 'mainnet-elastic',
      name: 'Elastic',
      adapter: 'elastic',
      proxyUrl: 'https://api.elrond.com',
      elasticUrl: 'https://elastic-aws.elrond.com',
      numInitCharactersForScAddress: 14,
      validatorDetails: true,
    },
  ],
};

window.CONFIG = CONFIG;

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = CONFIG;
}
