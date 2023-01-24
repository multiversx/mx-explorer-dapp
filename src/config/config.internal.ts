import { NetworkType } from 'types/network.types';
import { allApps, schema } from './sharedConfig';
import { links as sharedLinks } from './sharedConfig';
export * from './sharedConfig';

export const links: typeof sharedLinks = [];

export const networks: NetworkType[] = [
  {
    default: true,
    id: 'testnet',
    name: 'Testnet',
    adapter: 'api',
    theme: 'testnet',
    egldLabel: 'xEGLD',
    walletAddress: 'https://testnet-wallet.multiversx.com/',
    explorerAddress: 'https://testnet-explorer.multiversx.com/',
    apiAddress: 'https://testnet-api.multiversx.com'
  },
  // Testnets
  {
    id: 'testnet-azure-all-in-one-maiar',
    name: 'Maiar API All-In-One Testnet',
    adapter: 'elastic',
    egldLabel: 'xEGLD',
    proxyUrl: 'https://proxy-maiar.multiversx.com',
    elasticUrl: 'https://elastic-maiar.multiversx.com'
  },
  {
    id: 'testnet-cp-test01',
    name: 'ClusterPower Testnet 01',
    adapter: 'api',
    egldLabel: 'xEGLD',
    apiAddress: '***REMOVED***'
  },
  {
    id: 'testnet-do-ams',
    name: 'DigitalOcean Amsterdam Testnet',
    adapter: 'api',
    egldLabel: 'xEGLD',
    apiAddress: '***REMOVED***'
  },
  {
    id: 'testnet-upcloud-fra',
    name: 'Upcloud Frankfurt Testnet',
    adapter: 'api',
    egldLabel: 'xEGLD',
    apiAddress: '***REMOVED***'
  },
  {
    id: 'testnet-do-lon',
    name: 'DigitalOcean London Testnet',
    adapter: 'api',
    egldLabel: 'xEGLD',
    apiAddress: '***REMOVED***'
  },
  {
    id: 'testnet-upcloud-mad',
    name: 'Upcloud Madrid Testnet',
    adapter: 'api',
    egldLabel: 'xEGLD',
    apiAddress: '***REMOVED***'
  },
  {
    id: 'testnet-do-multi',
    name: 'DigitalOcean MULTI Testnet',
    adapter: 'api',
    egldLabel: 'xEGLD',
    apiAddress: '***REMOVED***'
  },
  {
    id: 'testnet-do-shadowfork-four',
    name: 'SHADOWFORK 4 Testnet',
    adapter: 'api',
    egldLabel: 'xEGLD',
    apiAddress: '***REMOVED***'
  }
];

export const multiversxApps = allApps([
  {
    id: 'wallet',
    name: 'Internal Wallet', // navbar title
    url: '***REMOVED***'
  },
  {
    id: 'explorer',
    name: 'Internal Explorer',
    url: '***REMOVED***'
  }
]);

networks.forEach((network) => {
  schema.validate(network, { strict: true }).catch(({ errors }) => {
    console.error(`Config invalid format for ${network.id}`, errors);
  });
});
