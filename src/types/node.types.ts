import { SliceType } from 'types/general.types';

export interface NodeType {
  bls: string;
  name: string;
  type: NodeTypeEnum;
  status?: NodeApiStatusEnum;
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
  identityInfo?: IdentityType;
  auctionPosition?: number;
  auctionTopUp?: string;
  qualifiedStake?: string;
  auctionQualified?: boolean;
  isInDangerZone?: boolean;
  auctioned?: boolean;

  // TODO check if used
  receivedShardID?: number;
  computedShardID?: number;
}

export enum NodeTypeEnum {
  observer = 'observer',
  validator = 'validator'
}

export enum NodeStatusEnum {
  new = 'new',
  unknown = 'unknown',
  waiting = 'waiting',
  eligible = 'eligible',
  jailed = 'jailed',
  queued = 'queued',
  leaving = 'leaving',
  inactive = 'inactive',
  auction = 'auction'
}

export enum NodeStatusRawEnum {
  staked = 'staked',
  unStaked = 'unStaked',
  notStaked = 'notStaked'
}

const NodeApiStatusEnum = {
  ...NodeStatusEnum,
  ...NodeStatusRawEnum
};

export type NodeApiStatusEnum = NodeStatusEnum | NodeStatusRawEnum;

export interface IdentityType {
  name: string;
  score: number;
  stake: string;
  locked: string;
  stakePercent: number;
  validators: number;
  rank?: number;
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

  // not on API
  overallStakePercent?: number;
  validatorsPercent?: number;
  overallValidatorsPercent?: number;
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
  identityInfo?: IdentityType;
  identityDetails?: IdentityType; // local field - TODO - remove

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

export interface AuctionValidatorType {
  owner: string;
  name?: string;
  stake?: string;
  locked?: string;
  bls?: string;
  identity?: string;
  provider?: string;
  description?: string;
  avatar?: string;
  auctionTopUp?: string;
  qualifiedStake?: string;
  auctionValidators?: number;
  qualifiedAuctionValidators?: number;
  dangerZoneValidators?: number;
  droppedValidators?: number;
  auctionPosition?: number;
  distribution?: any;
}

export enum NodeQualificationStatusEnum {
  qualified = 'Qualified',
  notQualified = 'Not Qualified',
  dangerZone = 'Danger Zone'
}

export interface NodesIdentitiesSliceType extends SliceType {
  unprocessed: IdentityType[];
  nodesIdentities: IdentityType[];
}

export interface NodeStatusPreviewType {
  bls: NodeType['bls'];
  status: NodeApiStatusEnum;
  auctionQualified?: NodeType['auctionQualified'];
  isInDangerZone?: NodeType['isInDangerZone'];
}

export interface IndexedNodeStatusPreviewType extends NodeStatusPreviewType {
  index: number;
}

export interface NodesOverviewSliceType extends SliceType {
  nodes: IndexedNodeStatusPreviewType[];
  nodeDetails?: { [key: string]: NodeType };
}

export interface NodesOverviewAddSliceType {
  nodeDetails: NodeType;
}
