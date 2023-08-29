import { NetworkType } from 'types/network.types';
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
  }
];

export const multiversxApps = allApps([
  {
    id: 'wallet',
    name: 'Devnet Wallet', // navbar title
    url: 'https://devnet-wallet.multiversx.com'
  },
  {
    id: 'explorer',
    name: 'Devnet Explorer',
    url: 'http://devnet-explorer.multiversx.com'
  },
  {
    id: 'xexchange',
    name: 'Devnet xExchange',
    url: 'http://devnet.xexchange.com'
  },
  {
    id: 'xspotlight',
    name: 'Devnet xSpotlight',
    url: 'https://devnet.xspotlight.com/'
  }
]);

networks.forEach((network) => {
  schema.validate(network, { strict: true }).catch(({ errors }) => {
    console.error(`Config invalid format for ${network.id}`, errors);
  });
});
