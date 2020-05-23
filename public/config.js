const CONFIG = {
  metaChainShardId: 4294967295,
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
        validatorStatistics: (default) false
        disabledShards: array of shard numbers that don't show up in UI
    */
  testnets: [
    {
      default: true,
      id: 'battle-of-nodes',
      name: 'Battle of Nodes',
      nodeUrl: 'https://api.elrond.com',
      validatorsApiUrl: 'https://api.elrond.com',
      elasticUrl: 'https://elastic-aws.elrond.com',
      refreshRate: 6000,
      numInitCharactersForScAddress: 20,
      decimals: 4,
      denomination: 18,
      gasPrice: 200000000000,
      gasLimit: 50000,
      gasPerDataByte: 1500,
      gasLimitEditable: true,
      economics: true,
      data: true,
      validatorDetails: true,
      faucet: false,
      validatorStatistics: true,
    },
  ],
};

window.CONFIG = CONFIG;

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = CONFIG;
}
