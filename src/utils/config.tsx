import { ConfigType } from 'context/state';

const config: ConfigType = {
  networks: [
    {
      default: true,
      id: 'zero-to-one',
      name: 'Zero to One',
      apiUrl: 'https://api.elrond.com',
      // TODO: check axios not working inf wrong address ex: api-facade
      elasticUrl: 'https://api.elrond.com',
      adapter: 'api',
      // gasPrice: 200000000000,
      validatorDetails: true,
      erdLabel: 'EGLD',
      // nrOfShards: 5,
      // versionNumber: 'v1.0.123',
      theme: 'default',
    },
  ],
};

export default config;
