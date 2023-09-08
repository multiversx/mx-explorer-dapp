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

  // Internal Testnets
  ...getInternalNetworks()
];

export const multiversxApps = allApps();

networks.forEach((network) => {
  schema.validate(network, { strict: true }).catch(({ errors }) => {
    console.error(`Config invalid format for ${network.id}`, errors);
  });
});
