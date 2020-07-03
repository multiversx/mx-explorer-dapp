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
          default: true,
          id: 'azure',
          name: 'Azure WestEU Testnet',
          nodeUrl: 'http://51.144.228.174:8080',
          elasticUrl: 'http://13.81.247.54',
          numInitCharactersForScAddress: 20,
          faucet: true,
        },
      ]
    : []),
];

export default localTestnets;
