const localTestnets = [
  ...(process.env.NODE_ENV === 'development'
    ? [
        {
          default: true,
          id: 'testnet-do-toronto',
          name: 'Toronto',
          nodeUrl: 'http://159.203.3.48:8080',
          elasticUrl: '***REMOVED***',
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
        },
        {
          default: false,
          id: 'personal',
          name: 'Personal',
          nodeUrl: 'http://137.116.230.165:8079',
          elasticUrl: 'http://137.116.230.165:9200',
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
        },
      ]
    : []),
];

export default localTestnets;
