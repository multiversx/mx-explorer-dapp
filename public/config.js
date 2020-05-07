const CONFIG = {
  metaChainShardId: 4294967295,
  elrondApps: [
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
        bach32LocalTransform: (default) false
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
      gasPrice: 100000000000000,
      gasLimit: 100000,
      gasPerDataByte: 1500,
      gasLimitEditable: true,
      economics: true,
      data: true,
      validatorDetails: true,
      faucet: false,
      validatorStatistics: true,
      bach32LocalTransform: false,
    },
    // {
    //   id: 'bon-bach32',
    //   name: 'BoN (Bach32)',
    //   nodeUrl: 'https://api.elrond.com',
    //   validatorsApiUrl: 'https://api.elrond.com',
    //   elasticUrl: 'https://elastic-aws.elrond.com',
    //   refreshRate: 6000,
    //   numInitCharactersForScAddress: 20,
    //   decimals: 4,
    //   denomination: 18,
    //   gasPrice: 100000000000000,
    //   gasLimit: 100000,
    //   gasPerDataByte: 1500,
    //   gasLimitEditable: true,
    //   economics: true,
    //   data: true,
    //   validatorDetails: true,
    //   faucet: false,
    //   validatorStatistics: true,
    //   bach32LocalTransform: true,
    // },
    // {
    //   id: 'cryptobubbles',
    //   name: 'Crypto Bubbles',
    //   nodeUrl: 'https://cryptobubbles-api.elrond.com',
    //   elasticUrl: 'https://elastic-aws-game.elrond.com',
    //   refreshRate: 3000,
    //   numInitCharactersForScAddress: 17,
    //   wallet: false,
    //   validators: false,
    //   decimals: 0,
    //   denomination: 0,
    //   gasPrice: 10,
    //   gasLimit: 1000,
    //   gasPerDataByte: 1500,
    // },
    // {
    //   default: false,
    //   id: 'ireland',
    //   name: 'Ireland',
    //   nodeUrl: 'http://108.129.20.194:8080',
    //   elasticUrl: 'http://18.200.142.29',
    //   refreshRate: 6000,
    //   numInitCharactersForScAddress: 20,
    //   decimals: 4,
    //   denomination: 4,
    //   gasPrice: 10,
    //   gasLimit: 1000,
    // gasPerDataByte: 1500,
    //   gasLimitEditable: true,
    //   economics: true,
    //   data: true,
    //   validatorDetails: true,
    //   faucet: true,
    //   validatorStatistics: true,
    // },
    // {
    //   default: false,
    //   id: 'local',
    //   name: 'Local',
    //   nodeUrl: 'http://192.168.2.64:8001',
    //   elasticUrl: 'http://192.168.2.65',
    //   refreshRate: 6000,
    //   numInitCharactersForScAddress: 20,
    //   decimals: 4,
    //   denomination: 4,
    //   gasPrice: 10,
    //   gasLimit: 100000,
    // gasPerDataByte: 1500,
    //   gasLimitEditable: true,
    //   economics: true,
    //   data: true,
    //   validatorDetails: true,
    //   faucet: true,
    // },
  ],
};

window.CONFIG = CONFIG;

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = CONFIG;
}
