import { NetworkType } from 'types/network.types';

import { getStorageCustomNetworks } from './helpers';
import { allApps, schema } from './sharedConfig';
export * from './sharedConfig';

export const hasExtraNetworks = false;
export const links: NetworkUrlType[] = [];
export const networks: NetworkType[] = [
  {
    default: true,
    id: 'START_NAME_STOP',
    name: 'START_NAME_STOP',
    chainId: 'START_CHAIN_ID_STOP',
    adapter: 'api',
    theme: 'testnet',
    egldLabel: 'START_EGLD_LABEL_STOP',
    walletAddress: 'START_WALLET_ADDRESS_STOP',
    explorerAddress: 'START_EXPLORER_ADDRESS_STOP',
    nftExplorerAddress: 'START_NFT_EXPLORER_ADDRESS_STOP',
    isSovereign: 'START_IS_SOVEREIGN_STOP',
    apiAddress: 'START_API_ADDRESS_STOP'
  },

  // Saved Custom Network Configs
  ...getStorageCustomNetworks()
];

export const multiversxApps = allApps([
  {
    id: 'wallet',
    url: 'START_WALLET_ADDRESS_STOP'
  },
  {
    id: 'explorer',
    url: 'START_EXPLORER_ADDRESS_STOP'
  },
  {
    id: 'xexchange',
    url: 'https://devnet.xexchange.com'
  },
  {
    id: 'xspotlight',
    url: 'START_NFT_EXPLORER_ADDRESS_STOP'
  }
]);

networks.forEach((network) => {
  schema.validate(network, { strict: true }).catch(({ errors }) => {
    console.error(`Config invalid format for ${network.id}`, errors);
  });
});
