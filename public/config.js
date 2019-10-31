const CONFIG = {
  metaChainShardId: 4294967295,
  /*
      Legend:
        decimals: number of displayed ERD decimals in explorer
        denomination: number by which transaction are divided
        numInitCharactersForScAddress: number of zeros to hide
      Possbile flags:
        wallet: (default) true
        validators: (default) true
        validatorDetails: (default) false
        economics: (default) false
        data: (default) false
        faucet: (default) false (faucet)
    */
  testnets: [
    {
      default: true,
      id: 'testnet-1036',
      name: 'Testnet-1036',
      nodeUrl: 'https://wallet-api.elrond.com',
      elasticUrl: 'https://elastic-aws.elrond.com',
      numInitCharactersForScAddress: 20,
      decimals: 4,
      denomination: 4,
      gasPrice: 10,
      gasLimit: 1000,
      economics: true,
      data: true,
      validatorDetails: true,
      faucet: false,
    },
    {
      id: 'cryptobubbles',
      name: 'Crypto Bubbles',
      nodeUrl: 'https://cryptobubbles-api.elrond.com',
      elasticUrl: 'https://elastic-aws-game.elrond.com',
      numInitCharactersForScAddress: 18,
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
// eslint-disable-next-line no-new-func
const isBrowser = new Function('try {return this===window;}catch(e){ return false;}');
if (!isBrowser) module.exports = CONFIG;
