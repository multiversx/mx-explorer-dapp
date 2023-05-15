import { NetworkType } from 'types/network.types';
import { allApps, schema } from './sharedConfig';
import { links as sharedLinks } from './sharedConfig';
export * from './sharedConfig';

export const links: typeof sharedLinks = [];

export const networks: NetworkType[] = [
  {
    default: true,
    id: 'next',
    name: 'Next',
    adapter: 'api',
    theme: 'default',
    egldLabel: 'EGLD',
    walletAddress: 'https://wallet.multiversx.com',
    explorerAddress: 'https://explorer.multiversx.com',
    apiAddress: '***REMOVED***',
    extrasApi: '***REMOVED***'
  },
  {
    id: 'testnet',
    name: 'Testnet',
    adapter: 'api',
    theme: 'testnet',
    egldLabel: 'xEGLD',
    walletAddress: 'https://testnet-wallet.multiversx.com/',
    explorerAddress: 'https://testnet-explorer.multiversx.com/',
    apiAddress: 'https://testnet-api.multiversx.com'
  },
  {
    id: 'devnet',
    name: 'Devnet',
    chainId: 'D',
    adapter: 'api',
    theme: 'testnet',
    egldLabel: 'xEGLD',
    walletAddress: 'https://devnet-wallet.multiversx.com',
    explorerAddress: 'https://devnet-explorer.multiversx.com',
    apiAddress: 'https://devnet-api.multiversx.com'
  },
  {
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
    accessToken: true
  },
  // Testnets
  {
    id: 'testnet-tc-shadowfork-one',
    name: 'SHADOWFORK 1 Testnet',
    adapter: 'api',
    egldLabel: 'xEGLD',
    apiAddress: 'https://express-api-shadowfork-one.elrond.ro'
  },
  {
    id: 'testnet-do-shadowfork-four',
    name: 'SHADOWFORK 4 Testnet',
    adapter: 'api',
    egldLabel: 'xEGLD',
    apiAddress: '***REMOVED***'
  },
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
    id: 'testnet-cp-test02',
    name: 'ClusterPower Testnet 02',
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
  }
];

export const multiversxApps = allApps([
  {
    id: 'wallet',
    name: 'Wallet', // navbar title
    url: 'https://wallet.multiversx.com'
  },
  {
    id: 'explorer',
    name: 'Next Explorer',
    url: 'http://explorer.multiversx.com'
  }
]);

networks.forEach((network) => {
  schema.validate(network, { strict: true }).catch(({ errors }) => {
    console.error(`Config invalid format for ${network.id}`, errors);
  });
});
