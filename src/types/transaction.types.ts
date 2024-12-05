import { ELLIPSIS } from 'appConstants';
import { AccountAssetType } from './account.types';
import { ScamInfoType } from './general.types';
import { NftTypeEnum } from './nft.types';
import { TokenTypeEnum } from './token.types';

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
  status: TransactionStatusEnum;
  timestamp: number;
  value: string;
  price: number;
  action?: TransactionActionType;
  function?: string;
  scamInfo?: ScamInfoType;
  pendingResults?: boolean;
  receipt?: TransactionReceiptType;
  senderAssets?: AccountAssetType;
  receiverAssets?: AccountAssetType;
  guardianAddress?: string;
  guardianSignature?: string;
  isRelayed?: boolean;
  relayedVersion?: boolean;
  logs?: TransactionSCResultLogType;
  results?: TransactionSCResultType[];
  operations?: TransactionOperationType[];
  innerTransactions?: TransactionInnerType[];
}

// TRANSACTION SC RESULTS

export interface TransactionSCResultType {
  hash: string;
  callType: string;
  gasLimit: number;
  gasPrice: number;
  nonce: number;
  prevTxHash: string;
  receiver: string;
  sender: string;
  value: string;
  timestamp: number;
  data?: string;
  originalTxHash: string;
  returnMessage?: string;
  logs?: TransactionSCResultLogType;
  senderAssets?: AccountAssetType;
  receiverAssets?: AccountAssetType;
  miniBlockHash?: string;
}

export interface TransactionSCResultLogType {
  id: string;
  address: string;
  events: EventType[];
}

// TRANSACTION IN POOL

export interface TransactionInPoolType {
  txHash: string;
  sender: string;
  receiver: string;
  nonce: number;
  value: string;
  gasPrice: number;
  gasLimit: number;
  type: TransactionInPoolTypeEnum;
  senderShard: number;
  receiverShard: number;
  receiverUsername?: string;
  data?: string;
}

export enum TransactionInPoolTypeEnum {
  // UI only
  All = 'All',

  Transaction = 'Transaction',
  SmartContractResult = 'SmartContractResult',
  Reward = 'Reward'
}

// TRANSACTION LOGS

export interface LogType {
  hash: string;
  callType: string;
  gasLimit: number;
  gasPrice: number;
  nonce: number;
  prevTransactionHash: string;
  receiver?: string;
  sender: string;
  value: string;
  data?: string;
  originalTxHash: string;
  returnMessage?: string;
  logs?: any;
}

// TRANSACTION EVENTS

export enum TransactionFiltersEnum {
  miniBlockHash = 'miniBlockHash',
  senderShard = 'senderShard',
  receiverShard = 'receiverShard',
  sender = 'sender',
  receiver = 'receiver',
  method = 'function',
  before = 'before',
  after = 'after',
  status = 'status',
  search = 'search',
  token = 'token',
  transactionsInPoolType = 'type',
  hashes = 'hashes',
  isRelayed = 'isRelayed'
}

// Avoid issues with differences between methods and actions
export enum TransactionMethodsEnum {
  // esdtNft category
  transfer = 'transfer',
  // stake category
  delegate = 'delegate',
  stake = 'stake',
  unDelegate = 'unDelegate',
  stakeClaimRewards = 'claimRewards',
  reDelegateRewards = 'reDelegateRewards',
  withdraw = 'withdraw',
  // exchange category
  claimLockedAssets = 'claimLockedAssets',
  swapTokensFixedInput = 'swapTokensFixedInput',
  swapTokensFixedOutput = 'swapTokensFixedOutput',
  swap = 'swap',
  multiPairSwap = 'multiPairSwap',
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
  lockAssets = 'lockAssets',
  unlockAssets = 'unlockAssets',
  mergeLockedAssetTokens = 'mergeLockedAssetTokens',
  stakeFarm = 'stakeFarm',
  stakeFarmProxy = 'stakeFarmProxy',
  stakeFarmTokens = 'stakeFarmTokens',
  stakeFarmTokensProxy = 'stakeFarmTokensProxy',
  unstakeFarm = 'unstakeFarm',
  unstakeFarmProxy = 'unstakeFarmProxy',
  unstakeFarmTokens = 'unstakeFarmTokens',
  unstakeFarmTokensProxy = 'unstakeFarmTokensProxy',
  claimDualYield = 'claimDualYield',
  claimDualYieldProxy = 'claimDualYieldProxy',
  unbondFarm = 'unbondFarm',
  // builtin
  ClaimDeveloperRewards = 'ClaimDeveloperRewards',
  ChangeOwnerAddress = 'ChangeOwnerAddress',
  SetUserName = 'SetUserName',
  SaveKeyValue = 'SaveKeyValue',
  ESDTTransfer = 'ESDTTransfer',
  ESDTBurn = 'ESDTBurn',
  ESDTFreeze = 'ESDTFreeze',
  ESDTUnFreeze = 'ESDTUnFreeze',
  ESDTWipe = 'ESDTWipe',
  ESDTPause = 'ESDTPause',
  ESDTUnPause = 'ESDTUnPause',
  ESDTSetRole = 'ESDTSetRole',
  ESDTUnSetRole = 'ESDTUnSetRole',
  ESDTSetLimitedTransfer = 'ESDTSetLimitedTransfer',
  ESDTUnSetLimitedTransfer = 'ESDTUnSetLimitedTransfer',
  ESDTLocalBurn = 'ESDTLocalBurn',
  ESDTLocalMint = 'ESDTLocalMint',
  ESDTNFTTransfer = 'ESDTNFTTransfer',
  ESDTNFTCreate = 'ESDTNFTCreate',
  ESDTNFTAddQuantity = 'ESDTNFTAddQuantity',
  ESDTNFTBurn = 'ESDTNFTBurn',
  ESDTNFTAddURI = 'ESDTNFTAddURI',
  ESDTNFTUpdateAttributes = 'ESDTNFTUpdateAttributes',
  MultiESDTNFTTransfer = 'MultiESDTNFTTransfer',
  // guardian
  SetGuardian = 'SetGuardian',
  GuardAccount = 'GuardAccount',
  UnGuardAccount = 'UnGuardAccount',
  // xportal
  claim = 'claim',
  openMysteryBox = 'openMysteryBox'
}

export interface EventType {
  address: string;
  identifier: string;
  order: number;
  topics: string[];
  additionalData?: string[];
  data?: string;
}

// GENERAL

export interface TransactionReceiptType {
  value: string;
  sender: string;
  data: string;
}

export interface TransactionTokensType {
  esdts: string[];
  nfts: string[];
}

// TRANSACTION UI

export enum TransferTypeEnum {
  Transaction = 'Transaction',
  SmartContractResult = 'SmartContractResult',
  InnerTransaction = 'InnerTransaction',
  innerTx = 'innerTx', // temporary
  Reward = 'Reward'
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

export interface UITransactionInPoolType extends TransactionInPoolType {
  isNew?: boolean; // UI flag
}

export interface TransactionTableType {
  transactions: UITransactionType[];
  address?: string;
  token?: string;
  totalTransactions: number | typeof ELLIPSIS;
  title?: React.ReactNode;
  showDirectionCol?: boolean;
  dataChanged?: boolean;
  showLockedAccounts?: boolean;
  isScResultsTable?: boolean;
  isDataReady?: boolean;
  inactiveFilters?: TransactionFiltersEnum[];
}

export enum TransactionOperationDirectionEnum {
  out = 'out',
  in = 'in',
  self = 'self',
  internal = 'int'
}

export enum TransactionApiStatusEnum {
  success = 'success',
  pending = 'pending',
  invalid = 'invalid',
  fail = 'fail'
}

export enum TransactionExtraStatusEnum {
  notExecuted = 'notExecuted',
  failed = 'failed', // TODO: remove when ready
  rewardReverted = 'reward-reverted'
}

const TransactionStatusEnum = {
  ...TransactionApiStatusEnum,
  ...TransactionExtraStatusEnum
};

export type TransactionStatusEnum =
  | TransactionApiStatusEnum
  | TransactionExtraStatusEnum;

// TRANSACTION ACTION

export interface TransactionActionType {
  category: string;
  name: TransactionActionEnum;
  description?: string;
  value?: number;
  arguments?: { [key: string]: any };
}

export interface TransactionTokenArgumentType {
  type: NftTypeEnum | TokenTypeEnum;
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

export interface TransactionUnwrapperType {
  token?: TransactionTokenArgumentType[];
  tokenNoValue?: TransactionTokenArgumentType[];
  tokenNoLink?: TransactionTokenArgumentType[];
  address?: string;
  egldValue?: string;
  value?: string;
  providerName?: string;
  providerAvatar?: string;
}

export enum TransactionActionEnum {
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
  multiPairSwap = 'multiPairSwap',
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
  lockAssets = 'lockAssets',
  unlockAssets = 'unlockAssets',
  mergeLockedAssetTokens = 'mergeLockedAssetTokens',
  stakeFarm = 'stakeFarm',
  stakeFarmProxy = 'stakeFarmProxy',
  stakeFarmTokens = 'stakeFarmTokens',
  stakeFarmTokensProxy = 'stakeFarmTokensProxy',
  unstakeFarm = 'unstakeFarm',
  unstakeFarmProxy = 'unstakeFarmProxy',
  unstakeFarmTokens = 'unstakeFarmTokens',
  unstakeFarmTokensProxy = 'unstakeFarmTokensProxy',
  claimDualYield = 'claimDualYield',
  claimDualYieldProxy = 'claimDualYieldProxy',
  unbondFarm = 'unbondFarm'
}

export enum TransactionActionCategoryEnum {
  esdtNft = 'esdtNft',
  mex = 'mex',
  stake = 'stake',
  scCall = 'scCall'
}

// TRANSACTION OPERATION

export interface TransactionOperationType {
  action: TransactionOperationActionEnum;
  type: TransactionVisibleOperationEnum | TransactionHiddenOperationEnum;
  esdtType: NftTypeEnum | TokenTypeEnum;
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
  senderAssets?: AccountAssetType;
  receiverAssets?: AccountAssetType;
  valueUSD?: number;
}

// INNER TRANSACTIONS ( RELAYED TX )

export interface TransactionInnerType {
  hash: string;
  nonce: number;
  value: string;
  receiver: string;
  sender: string;
  gasPrice: number;
  gasLimit: number;
  data: string;
  signature: string;
  chainID: string;
  version: number;
  relayer: string;
  options?: number;
  guardianSignature?: string;
  senderUsername?: string;
  receiverUsername?: string;
}

export enum TransactionInfoTabsEnum {
  details = 'details',
  logs = 'logs',
  innerTransactions = 'innerTransactions'
}

export enum TransactionOperationActionEnum {
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
  innerTransaction = 'innerTransaction',

  // to be deprecated ?
  ESDTLocalMint = 'ESDTLocalMint',
  ESDTLocalBurn = 'ESDTLocalBurn'
}

export enum TransactionVisibleOperationEnum {
  nft = 'nft',
  esdt = 'esdt',
  egld = 'egld'
}
export enum TransactionHiddenOperationEnum {
  none = 'none',
  error = 'error',
  log = 'log'
}
