import { NetworkType } from 'types/network.types';
import { allApps, schema, getInternalNetworks } from './sharedConfig';
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
    nftExplorerAddress: 'https://xspotlight.com',
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
    nftExplorerAddress: 'https://testnet.xspotlight.com',
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
    nftExplorerAddress: 'https://devnet.xspotlight.com',
    apiAddress: 'https://devnet-api.multiversx.com'
  },
  {
    id: 'devnet2',
    name: 'Devnet2',
    chainId: 'D',
    adapter: 'api',
    theme: 'testnet',
    egldLabel: 'xEGLD',
    walletAddress: 'https://devnet2-wallet.multiversx.com',
    explorerAddress: 'https://devnet2-explorer.multiversx.com',
    apiAddress: 'https://devnet2-api.multiversx.com'
  },
  {
    id: 'staging',
    name: 'Staging',
    adapter: 'api',
    theme: 'default',
    egldLabel: 'EGLD',
    walletAddress: '***REMOVED***',
    explorerAddress: '***REMOVED***',
    nftExplorerAddress: 'https://staging.xspotlight.com/',
    apiAddress: '***REMOVED***',
    growthApi: 'https://tools.multiversx.com/growth-api'
  },
  {
    id: 'mainnet',
    name: 'Mainnet',
    adapter: 'api',
    theme: 'default',
    egldLabel: 'EGLD',
    walletAddress: 'https://wallet.multiversx.com',
    explorerAddress: 'https://explorer.multiversx.com',
    nftExplorerAddress: 'https://xspotlight.com',
    apiAddress: '***REMOVED***',
    extrasApi: '***REMOVED***',
    growthApi: 'https://tools.multiversx.com/growth-api',
    accessToken: true
  },
  // Internal Testnets
  ...getInternalNetworks()
];

export const multiversxApps = allApps([
  {
    id: 'explorer',
    name: 'Next Explorer', // navbar title
    url: 'http://explorer.multiversx.com'
  }
]);

networks.forEach((network) => {
  schema.validate(network, { strict: true }).catch(({ errors }) => {
    console.error(`Config invalid format for ${network.id}`, errors);
  });
});
