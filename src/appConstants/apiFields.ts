export const TRANSACTIONS_TABLE_FIELDS = [
  'txHash',
  'originalTxHash',
  'receiver',
  'receiverAssets',
  'receiverShard',
  'sender',
  'senderAssets',
  'senderShard',
  'status',
  'value',
  'timestamp',
  'round',
  'tokenValue',
  'tokenIdentifier',
  'function',
  'action',
  'type',
  'guardianSignature',
  'relayer',
  'isRelayed',
  'relayedVersion'
];

export const IDENTITIES_FIELDS = [
  'rank',
  'identity',
  'locked',
  'stake',
  'topUp',
  'avatar',
  'name',
  'validators'
];

export const PROVIDERS_FIELDS = [
  'identity',
  'provider',
  'stake',
  'numNodes',
  'apr',
  'serviceFee',
  'delegationCap'
];

export const NODE_STATUS_PREVIEW_FIELDS = [
  'bls',
  'status',
  'type',
  'auctionQualified',
  'isInDangerZone'
];

export const ACCOUNT_TOKENS_FIELDS = [
  'type',
  'identifier',
  'collection',
  'name',
  'ticker',
  'decimals',
  'assets',
  'price',
  'totalLiquidity',
  'isLowLiquidity',
  'lowLiquidityThresholdPercent',
  'balance',
  'valueUsd'
];
