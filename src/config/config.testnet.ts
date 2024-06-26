import { NetworkType } from 'types/network.types';
import { allApps, schema } from './sharedConfig';
export * from './sharedConfig';

export const networks: NetworkType[] = [
  {
    default: true,
    id: 'testnet',
    name: 'Testnet',
    chainId: 'local-testnet',
    adapter: 'api',
    theme: 'testnet',
    egldLabel: 'xCNET',
    walletAddress: 'https://testnet-wallet.multiversx.com',
    explorerAddress: 'https://testnet-explorer.multiversx.com',
    nftExplorerAddress: 'https://testnet.xspotlight.com',
    apiAddress: 'http://31.207.87.10:3001'
  }
];

export const multiversxApps = allApps([
  {
    id: 'wallet',
    url: 'https://testnet-wallet.multiversx.com'
  },
  {
    id: 'explorer',
    url: 'http://testnet-explorer.multiversx.com'
  },
  {
    id: 'xspotlight',
    url: 'https://testnet.xspotlight.com'
  },
  {
    id: 'bridge',
    url: 'https://testnet-bridge.multiversx.com'
  }
]);

networks.forEach((network) => {
  schema.validate(network, { strict: true }).catch(({ errors }) => {
    console.error(`Config invalid format for ${network.id}`, errors);
  });
});