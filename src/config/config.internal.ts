import { NetworkType } from 'types/network.types';
import {
  allApps,
  getInternalNetworks,
  links as sharedLinks,
  schema
} from './sharedConfig';
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
    nftExplorerAddress: 'https://testnet.xspotlight.com',
    apiAddress: 'https://testnet-api.multiversx.com'
  },
  // Internal Testnets
  ...getInternalNetworks()
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
