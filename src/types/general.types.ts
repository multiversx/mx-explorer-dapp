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

export interface AssetType {
  name: string;
  description?: string;
  tags?: string[];
  iconPng?: string;
  iconSvg?: string;
}

export enum TokenSortEnum {
  price = 'price',
  marketCap = 'marketCap',
  accounts = 'accounts',
  transactions = 'transactions'
}

export interface RolesType {
  address: string;
  roles: string[];
}

export enum NftEnumType {
  NonFungibleESDT = 'NonFungibleESDT',
  SemiFungibleESDT = 'SemiFungibleESDT',
  MetaESDT = 'MetaESDT'
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
    attributes?: { value?: string; trait_type?: string }[];
  };
  media?: {
    url: string;
    originalUrl: string;
    thumbnailUrl: string;
    fileType: string;
    fileSize: number;
  }[];
  rarities?: {
    statistical?: {
      rank?: number;
      score?: number;
    };
    trait?: {
      rank?: number;
      score?: number;
    };
    jaccardDistances?: {
      rank?: number;
      score?: number;
    };
    openRarity?: {
      rank?: number;
      score?: number;
    };
    custom?: {
      rank?: number;
      score?: number;
    };
  };
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
  receiver: string;
  sender: string;
  timestamp: number;
  value: string;
  data?: string;
  returnMessage?: string;
}

export enum TxFiltersEnum {
  miniBlockHash = 'miniBlockHash',
  senderShard = 'senderShard',
  receiverShard = 'receiverShard',
  sender = 'sender',
  receiver = 'receiver',
  method = 'function',
  before = 'before',
  after = 'after',
  status = 'status',
  search = 'search'
}

export interface TransactionTokensType {
  esdts: string[];
  nfts: string[];
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
  unlockAssets = 'unlockAssets',
  mergeLockedAssetTokens = 'mergeLockedAssetTokens'
}

export enum TxActionCategoryEnum {
  esdtNft = 'esdtNft',
  mex = 'mex',
  stake = 'stake',
  scCall = 'scCall'
}

export interface TokenArgumentType {
  type: NftEnumType | 'FungibleESDT';
  name: string;
  ticker: string;
  collection?: string;
  identifier?: string;
  token?: string;
  decimals: number;
  value: string;
  providerName?: string;
  providerAvatar?: string;
  svgUrl?: string;
  valueUSD?: number;
}

export interface TxActionType {
  category: string;
  name: TxActionsEnum;
  description?: string;
  arguments?: { [key: string]: any };
}

export interface UnwrapperType {
  token?: TokenArgumentType[];
  tokenNoValue?: TokenArgumentType[];
  tokenNoLink?: TokenArgumentType[];
  address?: string;
  egldValue?: string;
  value?: string;
  providerName?: string;
  providerAvatar?: string;
}

export enum TransactionOperationActionType {
  none = 'none',
  transfer = 'transfer',
  burn = 'burn',
  addQuantity = 'addQuantity',
  create = 'create',
  multiTransfer = 'multiTransfer',
  localMint = 'localMint',
  localBurn = 'localBurn',
  wipe = 'wipe',
  freeze = 'freeze',
  writeLog = 'writeLog',
  signalError = 'signalError',

  // to be deprecated ?
  ESDTLocalMint = 'ESDTLocalMint',
  ESDTLocalBurn = 'ESDTLocalBurn'
}

export enum VisibleTransactionOperationType {
  nft = 'nft',
  esdt = 'esdt',
  egld = 'egld'
}
export enum HiddenTransactionOperationType {
  none = 'none',
  error = 'error',
  log = 'log'
}
export interface OperationType {
  action: TransactionOperationActionType;
  type: VisibleTransactionOperationType | HiddenTransactionOperationType;
  esdtType: NftEnumType | 'FungibleESDT';
  collection?: string;
  name: string;
  identifier: string;
  sender: string;
  receiver: string;
  value: string;
  decimals: number;
  data?: string;
  message?: string;
  svgUrl?: string;
  senderAssets?: AssetType;
  receiverAssets?: AssetType;
  valueUSD?: number;
}

export interface LogType {
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
  logs?: any;
}

export interface EventType {
  address: string;
  identifier: string;
  topics: string[];
  order: number;
  data?: string;
}

export interface ResultLogType {
  id: string;
  address: string;
  events: EventType[];
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
  logs?: ResultLogType;
  senderAssets?: AssetType;
  receiverAssets?: AssetType;
  miniBlockHash?: string;
}

export interface ReceiptType {
  value: string;
  sender: string;
  data: string;
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
  function?: string;
  logs?: {
    id: string;
    address: string;
    events: EventType[];
  };
  scamInfo?: ScamInfoType;
  pendingResults?: boolean;
  receipt?: ReceiptType;
  senderAssets?: AssetType;
  receiverAssets?: AssetType;
}

export enum TransferTypeEnum {
  Transaction = 'Transaction',
  SmartContractResult = 'SmartContractResult'
}

export interface TransactionsResponseType {
  data?: UITransactionType[];
  success: boolean | undefined;
}

export interface TransactionsCountResponseType {
  data?: number;
  success: boolean | undefined;
}
export interface TransferType extends TransactionType {
  type?: TransferTypeEnum;
  originalTxHash?: string;
}

export interface UITransactionType extends TransferType {
  isNew?: boolean; // UI flag
  tokenValue?: string;
  tokenIdentifier?: string;
}

export interface TransactionsTableType {
  transactions: UITransactionType[];
  address?: string;
  totalTransactions: number | '...';
  size: number;
  title?: React.ReactNode;
  directionCol?: boolean;
  dataChanged?: boolean;
  showLockedAccounts?: boolean;
  inactiveFilters?: TxFiltersEnum[];
}

export enum ApiTxStatusEnum {
  success = 'Success',
  pending = 'Pending',
  invalid = 'Invalid',
  fail = 'Fail'
}

export enum ExtraTxStatusEnum {
  notExecuted = 'Not Executed',
  failed = 'Failed', // TODO: remove when ready
  rewardReverted = 'reward-reverted'
}

export type TxStatusEnum = ApiTxStatusEnum | ExtraTxStatusEnum;

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

export interface NodesVersionsType {
  name: string;
  percent: number;
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
  online: false;
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