import { ConfigType } from 'context/state';

const config: ConfigType = {
  metaChainShardId: 4294967295,
  erdLabel: 'eGLD',
  elrondApps: [
    { id: 'main-site', name: 'Main site', to: 'https://elrond.com/' },
    { id: 'wallet', name: 'Wallet', to: 'https://wallet.elrond.com/' },
    { id: 'staking', name: 'Staking', to: 'https://genesis.elrond.com' },
    { id: 'pre-staking', name: 'Pre-staking', to: 'https://stake.elrond.com' },
    { id: 'explorer', name: 'Explorer', to: 'https://explorer.elrond.com/' },
    { id: 'docs', name: 'Docs', to: 'https://docs.elrond.com/' },
  ],
  explorerApi: 'https://explorer-api.elrond.com',
  secondary: false,
  testnets: [
    {
      default: true,
      id: 'zero-to-one',
      name: 'Zero to One',
      numInitCharactersForScAddress: 20,
      apiUrl: 'https://api.elrond.com',
      refreshRate: 6000,
      // TODO: check axios not working inf wrong address ex: api-facade
      elasticUrl: 'https://api.elrond.com',
      adapter: 'api',
      decimals: 4,
      denomination: 18,
      gasPrice: 200000000000,
      gasLimit: 50000,
      gasPerDataByte: 1500,
      validatorDetails: true,
      nrOfShards: 5,
      versionNumber: 'v1.0.123',
      fetchedFromNetworkConfig: true,
    },
  ],
};

export default config;
