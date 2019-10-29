const CONFIG = {
  // eslint-disable-line
  storageKeyDerivation: 'kd',
  storageAccountData: 'account',
  metaChainShardId: 4294967295,
  blockSize: 6,
  /*
      Legend:
        decimals: number of displayed ERD decimals in explorer
        denomination: number by which transaction are divided
      Possbile flags:
        wallet: (default) true
        validators: (default) true
        validatorInfos: (default) false
        economics: (default) false
        data: (default) false
        requestTokens: (default) false (faucet)
    */
  testnets: [
    {
      default: true,
      id: 'testnet-1036',
      name: 'Testnet-1036',
      nodeUrl: 'https://wallet-api.elrond.com',
      elasticUrl: 'https://elastic-aws.elrond.com',
      decimals: 4,
      denomination: 4,
      gasPrice: 10,
      gasLimit: 1000,
      economics: true,
      data: true,
      validatorInfos: true,
      requestTokens: false,
    },
    {
      id: 'cryptobubbles',
      name: 'Crypto Bubbles',
      nodeUrl: 'https://cryptobubbles-api.elrond.com',
      elasticUrl: 'https://elastic-aws-game.elrond.com',
      wallet: false,
      validators: false,
      decimals: 0,
      denomination: 0,
      gasPrice: 10,
      gasLimit: 1000,
    },
  ],
};

window.CONFIG = CONFIG;
module.exports = CONFIG;
