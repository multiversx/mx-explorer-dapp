import { IdentityType } from 'context/state';

export interface ScamInfoType {
  type: string;
  info: string;
}
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
  scamInfo?: ScamInfoType;
  isUpgradeable?: boolean;
  isReadable?: boolean;
  isPayable?: boolean;
  isPayableBySmartContract?: boolean;
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
  transactions: number;
  accounts: number;
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
  type: NftEnumType;
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

export enum NftEnumType {
  NonFungibleESDT = 'NonFungibleESDT',
  SemiFungibleESDT = 'SemiFungibleESDT',
  MetaESDT = 'MetaESDT',
}
export interface NftType {
  identifier: string;
  collection: string;
  ticker?: string;
  timestamp: number;
  attributes: string;
  nonce: number;
  type: NftEnumType;
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
  media?: {
    url: string;
    originalUrl: string;
    thumbnailUrl: string;
    fileType: string;
    fileSize: number;
  }[];
  scamInfo?: ScamInfoType;
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

export interface OperationsTokensType {
  esdts: TokenType[];
  nfts: NftType[];
}

export enum TxActionsEnum {
  // esdtNft category
  transfer = 'transfer',
  // stake category
  delegate = 'delegate',
  stake = 'stake',
  unDelegate = 'unDelegate',
  stakeClaimRewards = 'claimRewards',
  reDelegateRewards = 'reDelegateRewards',
  withdraw = 'withdraw',
  // mex category
  claimLockedAssets = 'claimLockedAssets',
  swapTokensFixedInput = 'swapTokensFixedInput',
  swapTokensFixedOutput = 'swapTokensFixedOutput',
  swap = 'swap',
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

export enum TxActionCategoryEnum {
  esdtNft = 'esdtNft',
  mex = 'mex',
  stake = 'stake',
  scCall = 'scCall',
}

export interface TokenArgumentType {
  type: string;
  name: string;
  ticker: string;
  collection?: string;
  identifier?: string;
  token?: string;
  decimals: number;
  value: string;
  providerName?: string;
  providerAvatar?: string;
}

export interface TxActionType {
  category: string;
  name: TxActionsEnum;
  description?: string;
  arguments?: { [key: string]: any };
}

export interface UnwrapperType {
  token?: TokenArgumentType[];
  address?: string;
  value?: string;
  providerName?: string;
  providerAvatar?: string;
}

export interface OperationType {
  action: string;
  type: string;
  collection?: string;
  identifier: string;
  sender: string;
  receiver: string;
  value: string;
}

export interface ResultType {
  hash: string;
  callType: string;
  gasLimit: number;
  gasPrice: number;
  nonce: number;
  prevTxHash: string;
  receiver?: string;
  sender: string;
  value: string;
  data?: string;
  originalTxHash: string;
  returnMessage?: string;
}

export interface EventType {
  address: string;
  identifier: string;
  topics: string[];
}

export interface TransactionType {
  fee?: string;
  blockHash: string;
  data: string;
  gasLimit: number;
  gasPrice: number;
  gasUsed: number;
  txHash: string;
  miniBlockHash: string;
  nonce: number;
  receiver: string;
  receiverShard: number;
  round: number;
  sender: string;
  senderShard: number;
  signature: string;
  status: string;
  timestamp: number;
  value: string;
  price: number;
  results?: ResultType[];
  operations?: OperationType[];
  action?: TxActionType;
  logs?: {
    address: string;
    events: EventType[];
  };
  scamInfo?: ScamInfoType;
}

export interface UITransactionType extends TransactionType {
  isNew?: boolean; // UI flag
  tokenValue?: string;
  tokenIdentifier?: string;
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
