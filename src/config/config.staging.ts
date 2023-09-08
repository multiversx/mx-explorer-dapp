import { NetworkType } from 'types/network.types';
import { allApps, schema } from './sharedConfig';
export * from './sharedConfig';

export const networks: NetworkType[] = [
  {
    default: true,
    id: 'mainnet',
    name: 'Mainnet',
    adapter: 'api',
    theme: 'default',
    egldLabel: 'EGLD',
    walletAddress: '***REMOVED***',
    explorerAddress: '***REMOVED***',
    nftExplorerAddress: 'https://xspotlight.com',
    apiAddress: '***REMOVED***',
    growthApi: 'https://tools.multiversx.com/growth-api'
  }
];

export const multiversxApps = allApps([
  {
    id: 'wallet',
    url: '***REMOVED***'
  },
  {
    id: 'explorer',
    url: 'http://***REMOVED***'
  }
]);

networks.forEach((network) => {
  schema.validate(network, { strict: true }).catch(({ errors }) => {
    console.error(`Config invalid format for ${network.id}`, errors);
  });
});
