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
          id: 'testnet-do-toronto',
          name: 'DigitalOcean TOR Testnet',
          nodeUrl: '***REMOVED***',
          elasticUrl: '***REMOVED***',
          numInitCharactersForScAddress: 14,
          gasLimitEditable: true,
          data: true,
          validatorDetails: true,
          faucet: false,
        },
      ]
    : []),
];

export default localTestnets;
