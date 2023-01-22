import {
  DECIMALS,
  DIGITS,
  GAS_LIMIT,
  GAS_PER_DATA_BYTE,
  GAS_PRICE_MODIFIER,
  GAS_PRICE as DEFAULT_GAS_PRICE,
} from '@multiversx/sdk-dapp/constants/index';
import { NetworkType as NetworkConfigType } from '@multiversx/sdk-dapp/types/network.types';
import { object, string, boolean } from 'yup';

const GAS_PRICE = String(DEFAULT_GAS_PRICE);

export { DECIMALS, DIGITS, GAS_LIMIT, GAS_PER_DATA_BYTE, GAS_PRICE_MODIFIER, GAS_PRICE };

export const links: NetworkUrlType[] = [
  {
    id: 'mainnet',
    name: 'Mainnet',
    url: 'https://explorer.multiversx.com/',
  },
  {
    id: 'testnet',
    name: 'Testnet',
    url: 'https://testnet-explorer.multiversx.com/',
  },
  {
    id: 'devnet',
    name: 'Devnet',
    url: 'https://devnet-explorer.multiversx.com/',
  },
];

export const allApps = (props: { id: string; name: string; url: string }[]) => [
  {
    id: 'main-site',
    name: 'Main site',
    url: 'https://multiversx.com/',
  },
  ...props,
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
  {
    id: 'bridge',
    name: 'Bridge',
    url: 'https://ad-astra.multiversx.com/',
  },
  {
    id: 'docs',
    name: 'Docs',
    url: 'https://docs.multiversx.com/',
  },
];

export const networkBaseSchema = object({
  default: boolean(),
  id: string().defined().required(),
  egldLabel: string().defined().required(),
  name: string().defined().required(),
  theme: string().oneOf(['default', 'testnet']),
  walletAddress: string(),
  explorerAddress: string(),
  accessToken: boolean(),
}).required();

export const adapterSchema = object({
  extrasApi: string().when('accessToken', {
    is: true,
    then: string().required(),
  }),
  adapter: string().defined().oneOf(['api', 'elastic']),
  apiAddress: string().when('adapter', {
    is: 'api',
    then: string().required(),
  }),
  growthApi: string().when('adapter', {
    is: 'api',
    then: string().when('id', {
      is: 'mainnet',
      then: string().required(),
    }),
  }),
  elasticUrl: string().when('adapter', {
    is: 'elastic',
    then: string().required(),
  }),
  proxyUrl: string().when('adapter', {
    is: 'elastic',
    then: string().required(),
  }),
}).required();

export const schema = networkBaseSchema.concat(adapterSchema);

export interface NetworkType extends Partial<NetworkConfigType> {
  adapter: 'api' | 'elastic';
  theme?: string;
  default?: boolean;
  accessToken?: boolean;
  extrasApi?: string;
  growthApi?: string;
  elasticUrl?: string;
  proxyUrl?: string;
}

export interface NetworkUrlType {
  id: string;
  name: string;
  url: string;
}
