import { ConfigType } from 'context/state';

export const config: ConfigType = {
  links: [],
  multiversXApps: [
    {
      id: 'main-site',
      name: 'MultiversX',
      url: 'https://multiversx.com/',
    },
    {
      id: 'wallet',
      name: 'Devnet Wallet',
      url: 'https://devnet-wallet.multiversx.com',
    },
    {
      id: 'explorer',
      name: 'Devnet Explorer', // navbar title
      url: 'http://devnet-explorer.multiversx.com',
    },
    {
      id: 'bridge',
      name: 'Bridge',
      url: 'https://bridge.multiversx.com/',
    },
    {
      id: 'docs',
      name: 'Docs',
      url: 'https://docs.multiversx.com/',
    },
    {
      id: 'growth',
      name: 'Growth',
      url: 'https://growth.multiversx.com/',
    },
    {
      id: 'xexchange',
      name: 'xExchange',
      url: 'https://xexchange.com/',
    },
    {
      id: 'xlaunchpad',
      name: 'xLaunchpad',
      url: 'https://xlaunchpad.com/',
    },
  ],
  networks: [
    {
      default: true,
      id: 'zero-to-one',
      name: 'Zero to One',
      apiUrl: 'https://api.multiversx.com',
      // TODO: check axios not working inf wrong address ex: api-facade
      elasticUrl: 'https://api.multiversx.com',
      adapter: 'api',
      erdLabel: 'EGLD',
      theme: 'default',
    },
  ],
};
