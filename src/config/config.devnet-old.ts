import { NetworkType } from 'types/network.types';
import { allApps, schema } from './sharedConfig';
export * from './sharedConfig';

export const networks: NetworkType[] = [
  {
    default: true,
    id: 'devnet-old',
    name: 'Devnet Old',
    chainId: 'D',
    adapter: 'api',
    theme: 'testnet',
    egldLabel: 'xEGLD',
    walletAddress: 'https://devnet-old-wallet.multiversx.com',
    explorerAddress: 'https://devnet-old-explorer.multiversx.com',
    apiAddress: 'https://devnet-old-api.multiversx.com'
  }
];

export const multiversxApps = allApps([
  {
    id: 'wallet',
    url: 'https://devnet-old-wallet.multiversx.com'
  },
  {
    id: 'explorer',
    url: 'http://devnet-old-explorer.multiversx.com'
  }
]);

networks.forEach((network) => {
  schema.validate(network, { strict: true }).catch(({ errors }) => {
    console.error(`Config invalid format for ${network.id}`, errors);
  });
});
