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
  activeValidators: number;
  queueSize: number;
  staked: number;
  totalValidators: number;
  apr?: number;
  waitingList?: number;
  deliquentStake?: number;
  nodesVerions?: NodesVersionsType[];
}

export interface IdentityType {
  name: string;
  score: number;
  stake: number;
  stakePercent: number;
  overallStakePercent?: number;
  validators: number;
  twitter?: string;
  website?: string;
  location?: string;
  avatar?: string;
  identity?: string;
}

export interface NodeType {
  publicKey: string;
  peerType: 'waiting' | 'eligible' | 'new' | 'jailed' | 'leaving' | 'inactive';
  nodeType: 'observer' | 'validator';
  status: 'online' | 'offline';
  identity: string;
  versionNumber: string;
  shard: number;
  tempRating: number;
  rating: number;
  ratingModifier: number;
  nonce: number;
  numInstances: number;
  totalUpTime?: number;
  totalDownTime?: number;
  totalUpTimeSec?: number;
  totalDownTimeSec?: number;
  nodeName?: string;
  receivedShardID?: number;
  timeStamp?: string;
  computedShardID?: number;
  issues?: string[];
  owner?: string;
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
  nodes: NodeType[];
  identities: IdentityType[];
  blockchainTotalStake: number;
  shards: ShardType[];
  globalStake: GlobalStakeType | undefined;
  accountDetails: types.AccountType;
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
    nodes: [],
    identities: [],
    blockchainTotalStake: 0,
    shards: [],
    globalStake: undefined,
    accountDetails: {
      address: '',
      balance: '',
      nonce: 0,
      txCount: 0,
      claimableRewards: '',
    },
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
