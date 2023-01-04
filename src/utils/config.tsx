import { ConfigType } from 'context/state';

const config: ConfigType = {
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
      url: 'https://devnet-wallet.elrond.com',
    },
    {
      id: 'explorer',
      name: 'Devnet Explorer', // navbar title
      url: 'http://devnet-explorer.elrond.com',
    },
    {
      id: 'bridge',
      name: 'Bridge',
      url: 'https://bridge.elrond.com/',
    },
    {
      id: 'docs',
      name: 'Docs',
      url: 'https://docs.elrond.com/',
    },
    {
      id: 'growth',
      name: 'Growth',
      url: 'https://growth.elrond.com/',
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
      apiUrl: 'https://api.elrond.com',
      // TODO: check axios not working inf wrong address ex: api-facade
      elasticUrl: 'https://api.elrond.com',
      adapter: 'api',
      erdLabel: 'EGLD',
      theme: 'default',
    },
  ],
};

export default config;
