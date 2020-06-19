const localTestnets = [
  ...(process.env.NODE_ENV === 'development'
    ? [
        {
          default: false,
          id: 'testnet-azure-uks',
          name: 'Azure UK South Testnet',
          nodeUrl: 'http://51.132.25.1:8080',
          elasticUrl: 'http://51.11.131.187',
          refreshRate: 6000,
          numInitCharactersForScAddress: 14,
          decimals: 2,
          denomination: 18,
          gasLimitEditable: true,
          economics: true,
          data: true,
          validatorDetails: true,
          faucet: false,
          validatorStatistics: true,
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
