import { InferType } from 'yup';
import config, { defaultNetwork, schema, adapterSchema, networkLink } from './config';
import { storage, types } from 'helpers';

export type NetworkLinkType = InferType<typeof networkLink>;
export type NetworkType = InferType<typeof schema>;
export type AdapterType = InferType<typeof adapterSchema>;

export interface ConfigType {
  networks: NetworkType[];
  links: NetworkLinkType[];
  elrondApps: NetworkLinkType[];
}

export interface ShardType {
  shard: number;
  validators: number;
  activeValidators: number;
}

export interface NodesVersionsType {
  name: string;
  percent: number;
}

export interface GlobalStakeType {
  queueSize: number;
  staked: number;
  apr?: number;
  waitingList?: number;
  deliquentStake?: number;
  nodesVerions?: NodesVersionsType[];
}

export interface IdentityType {
  name: string;
  score: number;
  stake: string;
  locked: string;
  stakePercent: number;
  validators: number;
  rank?: number;
  overallStakePercent?: number;
  twitter?: string;
  website?: string;
  location?: string;
  avatar?: string;
  identity?: string;
  description?: string;
  topUp?: string;
  distribution?: any;
}

export interface NodeType {
  bls: string;
  name: string;
  type: 'observer' | 'validator';
  status?: 'waiting' | 'eligible' | 'new' | 'jailed' | 'leaving' | 'inactive' | 'queued';
  online: boolean;
  rating: number;
  tempRating: number;
  ratingModifier: number;
  shard: number;
  nonce: number;
  instances: number;
  version: string;
  stake: string;
  topUp: string;
  uptime: number;
  uptimeSec: number;
  downtime: number;
  downtimeSec: number;
  locked: string;
  topup: string;
  identity?: string;
  provider?: string;
  issues?: string[];

  leaderSuccess?: number;
  leaderFailure?: number;
  validatorSuccess?: number;
  validatorFailure?: number;
  validatorIgnoredSignatures?: number;

  // TODO check if used
  receivedShardID?: number;
  computedShardID?: number;
}

export interface StateType {
  config: ConfigType;
  defaultNetwork: NetworkType;
  activeNetwork: NetworkType;
  activeNetworkId: string;
  timeout: number; // axios
  refresh: {
    timestamp: number;
  };
  theme: string;
  shards: ShardType[];
  globalStake: GlobalStakeType | undefined;
  accountDetails: types.AccountType;
  accountTokens: {
    success: boolean | undefined;
    data: types.TokenType[];
  };
  usd: number | undefined;
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
    refresh: {
      timestamp: Date.now(),
    },
    theme: getTheme(),
    shards: [],
    globalStake: undefined,
    accountTokens: {
      success: undefined,
      data: [],
    },
    accountDetails: {
      address: '',
      balance: '',
      nonce: 0,
      txCount: 0,
      claimableRewards: '',
    },
    usd: undefined,
  };
};

const getTheme = (): StateType['theme'] => {
  const defaultNetwork = config.networks.find((network) => network.default);
  const isMainnet = defaultNetwork && defaultNetwork.id === 'mainnet';

  let theme = defaultNetwork && defaultNetwork.theme ? defaultNetwork.theme : 'light';

  if (isMainnet) {
    const savedTheme = storage.getFromLocal('theme');
    const systemDarkThemeOn = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (!savedTheme && systemDarkThemeOn) {
      theme = 'dark';
    } else {
      theme = savedTheme === 'dark' ? 'dark' : theme;
    }
  }
  return theme;
};

export default initialState;
