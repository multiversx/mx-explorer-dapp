import { IdentityType } from 'context/state';

export interface AccountType {
  address: string;
  balance: string;
  nonce: number;
  txCount: number;
  claimableRewards: string;
  code?: string;
  shard?: number;
  ownerAddress?: string;
  developerReward?: string;
  deployedAt?: number;
}

export interface TokenType {
  identifier: string;
  ticker?: string;
  name: string;
  balance?: string;
  decimals?: number;
  owner: string;
  minted: string;
  burnt: string;
  supply: string;
  canBurn: boolean;
  canChangeOwner: boolean;
  canFreeze: boolean;
  canMint: boolean;
  canPause: boolean;
  canUpgrade: boolean;
  canWipe: boolean;
  isPaused: boolean;
  assets?: {
    website?: string;
    description?: string;
    status?: string;
    pngUrl?: string;
    svgUrl?: string;
    social?: any;
  };
}

export interface CollectionType {
  collection: string;
  type: 'SemiFungibleESDT' | 'NonFungibleESDT' | 'MetaESDT';
  name: string;
  ticker: string;
  timestamp: number;
  canFreeze: boolean;
  canWipe: boolean;
  canPause: boolean;
  canTransferRole: boolean;
  owner: string;
  decimals?: number;
  assets?: {
    website?: string;
    description?: string;
    status?: string;
    pngUrl?: string;
    svgUrl?: string;
  };
}

export interface NftType {
  identifier: string;
  collection: string;
  ticker?: string;
  timestamp: number;
  attributes: string;
  nonce: number;
  type: 'SemiFungibleESDT' | 'NonFungibleESDT' | 'MetaESDT';
  name: string;
  creator: string;
  royalties: number;
  balance: string;
  uris?: string[];
  url?: string;
  thumbnailUrl?: string;
  tags?: string[];
  decimals?: number;
  owner?: string;
  supply?: string;
  isWhitelistedStorage?: boolean;
  owners?: {
    address: string;
    balance: string;
  }[];
  assets?: {
    website?: string;
    description?: string;
    status?: string;
    pngUrl?: string;
    svgUrl?: string;
  };
  metadata?: {
    description?: string;
    fileType?: string;
    fileUri?: string;
    fileName?: string;
  };
  scamInfo?: {
    type: string;
    info: string;
  };
}

export interface ScResultType {
  callType: string;
  gasLimit: number;
  gasPrice: number;
  nonce: number;
  prevTxHash: string;
  hash: string;
  originalTxHash: string;
  receiver?: string;
  sender: string;
  timestamp: number;
  value: string;
  data?: string;
  returnMessage?: string;
}

export enum TxActionsEnum {
  claimLockedAssets = 'claimLockedAssets',
  swapTokensFixedInput = 'swapTokensFixedInput',
  addLiquidity = 'addLiquidity',
  addLiquidityProxy = 'addLiquidityProxy',
  removeLiquidity = 'removeLiquidity',
  removeLiquidityProxy = 'removeLiquidityProxy',
  enterFarm = 'enterFarm',
  enterFarmProxy = 'enterFarmProxy',
  enterFarmAndLockRewards = 'enterFarmAndLockRewards',
  enterFarmAndLockRewardsProxy = 'enterFarmAndLockRewardsProxy',
  exitFarm = 'exitFarm',
  exitFarmProxy = 'exitFarmProxy',
  claimRewards = 'claimRewards',
  claimRewardsProxy = 'claimRewardsProxy',
  compoundRewards = 'compoundRewards',
  compoundRewardsProxy = 'compoundRewardsProxy',
  wrapEgld = 'wrapEgld',
  unwrapEgld = 'unwrapEgld',
}

export interface TokenArgumentType {
  type: string;
  name: string;
  collection: string;
  identifier: string;
  ticker: string;
  decimals: number;
  value: string;
}

type TokenStringType = 'token' | 'token1' | 'token2' | string;

export interface TxActionType {
  category: string;
  name: TxActionsEnum;
  description: string;
  arguments: Record<TokenStringType, TokenArgumentType>;
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
