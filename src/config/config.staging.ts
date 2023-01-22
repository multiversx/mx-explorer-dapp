import { allApps, NetworkType, schema } from './sharedConfig';
export * from './sharedConfig';

export const networks: NetworkType[] = [
  {
    default: true,
    id: 'mainnet',
    name: 'Mainnet',
    chainId: '1',
    adapter: 'api',
    theme: 'dark',
    egldLabel: 'EGLD',
    walletAddress: '***REMOVED***',
    explorerAddress: '***REMOVED***',
    apiAddress: '***REMOVED***',
    growthApi: 'https://tools.multiversx.com/growth-api',
  },
];

export const multiversxApps = allApps([
  {
    id: 'wallet',
    name: 'Wallet', // navbar title
    url: '***REMOVED***',
  },
  {
    id: 'explorer',
    name: 'Explorer',
    url: 'http://***REMOVED***',
  },
]);

networks.forEach((network) => {
  schema.validate(network, { strict: true }).catch(({ errors }) => {
    console.error(`Config invalid format for ${network.id}`, errors);
  });
});
