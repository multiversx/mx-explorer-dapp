import { NetworkType } from 'types/network.types';
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
    egldLabel: 'EGLD',
    walletAddress: 'https://battlenet-wallet.multiversx.com',
    explorerAddress: 'https://battlenet-explorer.multiversx.com',
    apiAddress: 'https://express-api-shadowfork-two.elrond.ro'
  }
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
