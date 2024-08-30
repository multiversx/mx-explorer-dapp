import { NetworkType } from 'types/network.types';

import { getStorageCustomNetworks } from './helpers';
import { allApps, schema } from './sharedConfig';
export * from './sharedConfig';

export const networks: NetworkType[] = [
  {
    default: true,
    id: 'mainnet',
    name: 'Mainnet',
    chainId: '1',
    adapter: 'api',
    theme: 'default',
    egldLabel: 'EGLD',
    walletAddress: 'https://wallet.multiversx.com',
    explorerAddress: 'https://explorer.multiversx.com',
    nftExplorerAddress: 'https://xspotlight.com',
    apiAddress: 'https://api.multiversx.com',
    growthApi: 'https://tools.multiversx.com/growth-api'
  },

  // Saved Custom Network Configs
  ...getStorageCustomNetworks()
];

export const multiversxApps = allApps();

networks.forEach((network) => {
  schema.validate(network, { strict: true }).catch(({ errors }) => {
    console.error(`Config invalid format for ${network.id}`, errors);
  });
});
