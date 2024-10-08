import { NetworkType } from 'types/network.types';

import { getStorageCustomNetworks } from './helpers';
import { allApps, schema } from './sharedConfig';
export * from './sharedConfig';

export const networks: NetworkType[] = [
  {
    default: true,
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

  // Saved Custom Network Configs
  ...getStorageCustomNetworks()
];

export const multiversxApps = allApps([
  {
    id: 'wallet',
    url: 'https://devnet-wallet.multiversx.com'
  },
  {
    id: 'explorer',
    url: 'https://devnet-explorer.multiversx.com'
  },
  {
    id: 'xexchange',
    url: 'https://devnet.xexchange.com'
  },
  {
    id: 'xspotlight',
    url: 'https://devnet.xspotlight.com'
  }
]);

networks.forEach((network) => {
  schema.validate(network, { strict: true }).catch(({ errors }) => {
    console.error(`Config invalid format for ${network.id}`, errors);
  });
});
