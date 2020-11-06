import { InferType } from 'yup';
import { CancelTokenSource } from 'axios';
import config, { defaultNetwork, schema, adapterSchema } from './config';
import { validatorData, brandData, ValidatorType } from './validators';
import { storage } from 'helpers';

export type NetworkType = InferType<typeof schema>;
export type AdapterType = InferType<typeof adapterSchema>;

export interface ConfigType {
  networks: NetworkType[];
}

export interface ShardType {
  shardId: number;
  validators: number;
  activeValidators: number;
}

export interface BrandType {
  name: string;
  avatar: string;
  identity: string;
  score: number;
  stake: number;
  twitter: string;
  web: string;
  location: string;
  stakePercent: number;
  overallStakePercent: number;
  nodesCount: number;
}
export interface IdentityType {
  name: string;
  twitter?: string;
  website?: string;
  location?: string;
  avatar?: string;
  identity: string;
  validators: number;
  score: number;
  stake: number;
  stakePercent: number;
  overallStakePercent: number;
}

export interface StateType {
  config: ConfigType;
  defaultNetwork: NetworkType;
  activeNetwork: NetworkType;
  activeNetworkId: string;
  timeout: number; // axios
  cancelToken: CancelTokenSource | undefined;
  refresh: {
    timestamp: number;
  };
  validatorData: typeof validatorData; // TODO: remove
  brandData: typeof brandData; // TODO: remove
  theme: string;
  nodes: ValidatorType[];
  brands: BrandType[]; // TODO: remove
  identities: IdentityType[];
  blockchainTotalStake: number;
  shards: ShardType[];
}

const initialState = (optionalConfig?: ConfigType): StateType => {
  const configObject = optionalConfig !== undefined ? optionalConfig : config;

  return {
    config: configObject,
    defaultNetwork:
      configObject.networks.filter((network) => network.default).pop() || defaultNetwork,
    activeNetwork:
      configObject.networks.filter((network) => network.default).pop() || defaultNetwork,
    activeNetworkId: '',
    timeout: 10 * 1000,
    cancelToken: undefined,
    refresh: {
      timestamp: Date.now(),
    },
    validatorData,
    brandData,
    theme: getTheme(),
    nodes: [],
    brands: [],
    identities: [],
    blockchainTotalStake: 0,
    shards: [],
  };
};

const getTheme = (): StateType['theme'] => {
  const isMainnet =
    config.networks.find((network) => network.id === 'mainnet' && network.default === true) !==
    undefined;
  const defaultNetwork = config.networks.find((network) => network.default);
  let theme = defaultNetwork ? defaultNetwork.theme : '';

  if (isMainnet) {
    const savedTheme = storage.getFromLocal('theme');
    const systemDarkThemeOn = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (!savedTheme && systemDarkThemeOn) {
      theme = 'dark';
    } else {
      theme = savedTheme === 'dark' ? 'dark' : theme;
    }
  }
  return theme ? theme : 'default';
};

export default initialState;
