import { AccountAssetType } from 'types';

export enum NetworkIdType {
  mainnet = 'mainnet',
  testnet = 'testnet',
  devnet = 'devnet'
}

export enum SortOrderEnum {
  asc = 'asc',
  desc = 'desc'
}

export interface ScamInfoType {
  type: string;
  info: string;
}

export interface RolesType {
  address: string;
  assets?: AccountAssetType;
  roles: string[];
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
  apr?: number;
  url?: string;
}
export interface ProviderType {
  provider: string;
  apr: string;
  delegationCap: string;
  locked: string;
  numUsers: number;
  numNodes: number;
  owner: string;
  serviceFee: number;
  stake: string;
  topUp: string;
  featured?: boolean;
  identity?: string;
  cumulatedRewards?: string;

  identityDetails?: IdentityType; // local field

  // not used
  initialOwnerFunds?: string;
  automaticActivation?: boolean;
  withDelegationCap?: boolean;
  changeableServiceFee?: boolean;
  checkCapOnRedelegate?: boolean;
  createdNonce?: number;
  unBondPeriod?: number;
  totalUnStaked?: string;

  totalUnStakedFromNodes?: string;
  totalUnBondedFromNodes?: string;
  maxDelegateAmountAllowed?: string;
  maxRedelegateAmountAllowed?: string;
}

export interface NodeType {
  bls: string;
  name: string;
  type: 'observer' | 'validator';
  status?:
    | 'waiting'
    | 'eligible'
    | 'new'
    | 'jailed'
    | 'leaving'
    | 'inactive'
    | 'queued';
  online: boolean;
  rating: number;
  tempRating: number;
  ratingModifier: number;
  shard: number;
  nonce: number;
  instances: number;
  version: string;
  owner: string;
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
  syncProgress?: number;

  leaderSuccess?: number;
  leaderFailure?: number;
  validatorSuccess?: number;
  validatorFailure?: number;
  validatorIgnoredSignatures?: number;
  position?: number;
  fullHistory?: boolean;

  // TODO check if used
  receivedShardID?: number;
  computedShardID?: number;
}

export interface BlockType {
  hash: string;
  nonce: number;
  shard: number;
  size: number;
  sizeTxs: number;
  timestamp: number;
  txCount: number;
  validators: string[];
  miniBlocksHashes: string[];
  notarizedBlocksHashes: string[];
  epoch?: number;
  prevHash?: string;
  proposer?: string;
  pubKeyBitmap?: string;
  round?: number;
  stateRootHash?: string;
  isNew?: boolean; // UI flag
  gasConsumed: number;
  gasRefunded: number;
  gasPenalized: number;
  maxGasLimit: number;
  proposerIdentity?: IdentityType;
}

//----------

export interface SliceType {
  isFetched: boolean;
}

export enum TrendEnum {
  up = 'up',
  down = 'down',
  neutral = 'neutral'
}
