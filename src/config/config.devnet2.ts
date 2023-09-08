import { NetworkType } from 'types/network.types';
import { allApps, schema } from './sharedConfig';
export * from './sharedConfig';

export const networks: NetworkType[] = [
  {
    default: true,
    id: 'devnet2',
    name: 'Devnet2',
    chainId: 'D',
    adapter: 'api',
    theme: 'testnet',
    egldLabel: 'xEGLD',
    walletAddress: 'https://devnet2-wallet.multiversx.com',
    explorerAddress: 'https://devnet2-explorer.multiversx.com',
    apiAddress: 'https://devnet2-api.multiversx.com'
  }
];

export const multiversxApps = allApps([
  {
    id: 'wallet',
    url: 'https://devnet2-wallet.multiversx.com'
  },
  {
    id: 'explorer',
    url: 'http://devnet2-explorer.multiversx.com'
  }
]);

networks.forEach((network) => {
  schema.validate(network, { strict: true }).catch(({ errors }) => {
    console.error(`Config invalid format for ${network.id}`, errors);
  });
});
