import { allApps, NetworkType, schema } from './sharedConfig';
export * from './sharedConfig';

export const networks: NetworkType[] = [
  {
    default: true,
    id: 'mainnet',
    name: 'Mainnet',
    adapter: 'api',
    theme: 'default',
    egldLabel: 'EGLD',
    walletAddress: 'https://wallet.multiversx.com',
    explorerAddress: 'https://explorer.multiversx.com',
    apiAddress: '***REMOVED***',
    extrasApi: '***REMOVED***',
    growthApi: 'https://tools.multiversx.com/growth-api',
    accessToken: true,
  },
];

export const multiversxApps = allApps([
  {
    id: 'wallet',
    name: 'Wallet', // navbar title
    url: 'https://wallet.multiversx.com',
  },
  {
    id: 'explorer',
    name: 'Explorer',
    url: 'http://explorer.multiversx.com',
  },
]);

networks.forEach((network) => {
  schema.validate(network, { strict: true }).catch(({ errors }) => {
    console.error(`Config invalid format for ${network.id}`, errors);
  });
});
