const CONFIG = {
  metaChainShardId: 4294967295,
<<<<<<< HEAD
=======
  erdLabel: 'eGLD',
>>>>>>> api
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
<<<<<<< HEAD
=======
      id: 'bridge',
      name: 'Bridge',
      to: 'https://bridge.elrond.com/',
    },
    {
>>>>>>> api
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
<<<<<<< HEAD
  testnets: [
    {
      default: true,
      id: 'battle-of-nodes',
      name: 'Battle of Nodes',
      nodeUrl: 'https://api.elrond.com',
      elasticUrl: 'https://elastic-aws.elrond.com',
=======
  networks: [
    {
      default: true,
      id: 'mainnet',
      name: 'Mainnet',
      adapter: 'api',
      apiUrl: 'https://api.elrond.com',
>>>>>>> api
      numInitCharactersForScAddress: 14,
      gasLimitEditable: true,
      data: true,
      validatorDetails: true,
      faucet: false,
    },
<<<<<<< HEAD
=======
    {
      id: 'testnet',
      name: 'Testnet',
      adapter: 'api',
      apiUrl: 'https://api-testnet.elrond.com',
      numInitCharactersForScAddress: 14,
      validatorDetails: true,
    },
>>>>>>> api
  ],
};

window.CONFIG = CONFIG;

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = CONFIG;
}
