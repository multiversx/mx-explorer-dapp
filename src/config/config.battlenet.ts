import { NetworkType } from 'types/network.types';

import { getStorageCustomNetworks } from './helpers';
import { allApps, schema } from './sharedConfig';
export * from './sharedConfig';

export const networks: NetworkType[] = [
  {
    default: true,
    id: 'battlenet',
    name: 'Battlenet',
    chainId: 'B',
    adapter: 'api',
    theme: 'testnet',
    egldLabel: 'xEGLD',
    walletAddress: 'https://battlenet-wallet.multiversx.com',
    explorerAddress: 'https://battlenet-explorer.multiversx.com',
    apiAddress: 'https://express-api-shadowfork-two.elrond.ro'
  },

  // Saved Custom Network Configs
  ...getStorageCustomNetworks()
];

export const multiversxApps = allApps([
  {
    id: 'wallet',
    url: 'https://battlenet-wallet.multiversx.com'
  },
  {
    id: 'explorer',
    url: 'https://battlenet-explorer.multiversx.com'
  },
  {
    id: 'xexchange',
    url: 'https://battlenet.xexchange.com'
  }
]);

networks.forEach((network) => {
  schema.validate(network, { strict: true }).catch(({ errors }) => {
    console.error(`Config invalid format for ${network.id}`, errors);
  });
});
