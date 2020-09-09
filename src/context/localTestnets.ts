const elastic: 'elastic' = 'elastic';

const localTestnets = [
  ...(process.env.NODE_ENV === 'development'
    ? [
        {
          default: false,
          id: 'mainnet-elastic',
          name: 'Elastic',
          adapter: elastic,
          proxyUrl: 'https://api.elrond.com',
          elasticUrl: 'https://elastic-aws.elrond.com',
          numInitCharactersForScAddress: 14,
          validatorDetails: true,
          faucet: false,
        },
      ]
    : []),
];

export default localTestnets;
