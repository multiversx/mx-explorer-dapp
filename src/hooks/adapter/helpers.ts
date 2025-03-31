import BigNumber from 'bignumber.js';
import {
  MAX_RESULTS,
  PAGE_SIZE,
  TRANSACTIONS_TABLE_FIELDS
} from 'appConstants';
import { TransactionInPoolTypeEnum } from 'types';
import {
  BaseApiType,
  AdapterProviderPropsType,
  GetTransactionsType,
  GetNodesType,
  GetProvidersType,
  GetTokensType,
  GetCollectionsType,
  GetNftsType,
  GetTransactionsInPoolType
} from 'types/adapter.types';

export const getAccountParams = (address?: string) =>
  address
    ? {
        sender: address,
        receiver: address,
        condition: 'should'
      }
    : {};

export function getTransactionsParams({
  page,
  size,
  order,
  fields = TRANSACTIONS_TABLE_FIELDS.join(','),

  senderShard,
  receiverShard,
  sender,
  receiver,
  senderOrReceiver,
  method,
  before,
  after,
  status,
  miniBlockHash,
  search,
  token,
  hashes,
  relayer,
  isRelayed = false,

  // include data
  withScResults = false,
  withOperations = false,
  withLogs = false,
  withScamInfo = false,
  withUsername = true,
  withBlockInfo = false,
  withTxsRelayedByAddress = false,
  withCrossChainTransfers = false,

  // not on api
  isCount = false
}: GetTransactionsType) {
  const params: AdapterProviderPropsType['params'] = {
    ...(isCount
      ? {}
      : {
          ...getPageParams({ page, size }),
          ...(fields ? { fields } : {}),
          ...(order ? { order } : {}),
          ...(withScResults ? { withScResults } : {}),
          ...(withOperations ? { withOperations } : {}),
          ...(withLogs ? { withLogs } : {}),
          ...(withScamInfo ? { withScamInfo } : {}),
          ...(withUsername ? { withUsername } : {}),
          ...(withBlockInfo ? { withBlockInfo } : {})
        }),
    ...(senderShard !== undefined ? { senderShard } : {}),
    ...(receiverShard !== undefined ? { receiverShard } : {}),
    ...(sender ? { sender } : {}),
    ...(receiver ? { receiver } : {}),
    ...(senderOrReceiver ? { senderOrReceiver } : {}),
    ...(method ? { function: method } : {}),
    ...(before ? { before } : {}),
    ...(after ? { after } : {}),
    ...(status ? { status } : {}),
    ...(miniBlockHash ? { miniBlockHash } : {}),
    ...(search ? { search } : {}),
    ...(token ? { token } : {}),
    ...(hashes ? { hashes } : {}),
    ...(relayer ? { relayer } : {}),
    ...(isRelayed ? { isRelayed } : {}),
    ...(withTxsRelayedByAddress ? { withTxsRelayedByAddress } : {}),
    ...(withCrossChainTransfers ? { withCrossChainTransfers } : {})
  };

  return params;
}

export function getTransactionsInPoolParams({
  page,
  size,

  sender,
  receiver,
  senderShard,
  receiverShard,
  type,

  // not on api
  isCount = false
}: GetTransactionsInPoolType) {
  const params: AdapterProviderPropsType['params'] = {
    ...(isCount ? {} : getPageParams({ page, size })),
    ...(senderShard !== undefined ? { senderShard } : {}),
    ...(receiverShard !== undefined ? { receiverShard } : {}),
    ...(sender ? { sender } : {}),
    ...(receiver ? { receiver } : {}),
    ...(type && type !== TransactionInPoolTypeEnum.All ? { type } : {})
  };

  return params;
}

export function getNodeParams({
  page,
  size,
  sort,
  order,
  fields,

  type,
  status,
  issues,
  search,
  shard,
  online,
  identity,
  provider,
  fullHistory,
  owner,
  isQualified,
  isAuctioned,
  isAuctionDangerZone,

  // include data
  withIdentityInfo,

  // not on api
  isCount = false
}: GetNodesType) {
  const params: AdapterProviderPropsType['params'] = {
    ...(isCount
      ? {}
      : {
          ...getPageParams({ page, size }),
          ...(sort !== undefined ? { sort } : {}),
          ...(order !== undefined ? { order } : {}),
          ...(fields !== undefined ? { fields } : {}),
          ...(withIdentityInfo !== undefined ? { withIdentityInfo } : {})
        }),
    ...(search !== undefined ? { search } : {}),
    ...(type !== undefined ? { type } : {}),
    ...(status !== undefined ? { status } : {}),
    ...(issues !== undefined ? { issues } : {}),
    ...(shard !== undefined ? { shard: parseInt(shard) } : {}),
    ...(online !== undefined ? { online } : {}),
    ...(identity !== undefined ? { identity } : {}),
    ...(provider !== undefined ? { provider } : {}),
    ...(owner !== undefined ? { owner } : {}),
    ...(fullHistory !== undefined ? { fullHistory } : {}),
    ...(isQualified !== undefined ? { isQualified } : {}),
    ...(isAuctioned !== undefined ? { isAuctioned } : {}),
    ...(isAuctionDangerZone !== undefined ? { isAuctionDangerZone } : {})
  };

  return params;
}

export function getProviderParams({
  identity,
  providers,
  withIdentityInfo
}: GetProvidersType) {
  const params: AdapterProviderPropsType['params'] = {
    ...(identity !== undefined ? { identity } : {}),
    ...(providers !== undefined ? { providers } : {}),
    ...(withIdentityInfo !== undefined ? { withIdentityInfo } : {})
  };
  return params;
}

export function getTokensParams({
  page,
  size,
  sort,
  order,
  fields,

  type,
  search,
  name,
  identifier,
  includeMetaESDT,

  // include data
  withUsername = true,

  // not on api
  isCount = false
}: GetTokensType) {
  const params: AdapterProviderPropsType['params'] = {
    ...(isCount
      ? {}
      : {
          ...getPageParams({ page, size }),
          ...(sort !== undefined ? { sort } : {}),
          ...(order !== undefined ? { order } : {}),
          ...(fields !== undefined ? { fields } : {}),
          ...(withUsername ? { withUsername } : {})
        }),
    ...(type !== undefined ? { type } : {}),
    ...(search !== undefined ? { search } : {}),
    ...(name !== undefined ? { name } : {}),
    ...(identifier !== undefined ? { identifier } : {}),
    ...(includeMetaESDT !== undefined ? { includeMetaESDT } : {})
  };

  return params;
}

export function getCollectionsParams({
  page,
  size,
  sort,
  order,
  fields,

  search,
  identifiers,
  type,
  excludeMetaESDT,

  // include data
  withOwner,

  // not on api
  isCount = false
}: GetCollectionsType) {
  const params: AdapterProviderPropsType['params'] = {
    ...(isCount
      ? {}
      : {
          ...getPageParams({ page, size }),
          ...(sort !== undefined ? { sort } : {}),
          ...(order !== undefined ? { order } : {}),
          ...(fields !== undefined ? { fields } : {}),
          ...(withOwner ? { withOwner } : {})
        }),
    ...(search !== undefined ? { search } : {}),
    ...(identifiers !== undefined ? { identifiers } : {}),
    ...(type !== undefined ? { type } : {}),
    ...(excludeMetaESDT !== undefined ? { excludeMetaESDT } : {})
  };

  return params;
}

export function getNftsParams({
  page,
  size,
  sort,
  order,
  fields,

  search,
  identifiers,
  type,
  collections,
  name,
  tags,
  creator,
  hasUris,
  includeFlagged = true,
  excludeMetaESDT,
  source,

  // include data
  withOwner = true,
  withSupply,
  withScamInfo,

  // not on api
  isCount = false
}: GetNftsType) {
  const params: AdapterProviderPropsType['params'] = {
    ...(isCount
      ? {}
      : {
          ...getPageParams({ page, size }),
          ...(sort !== undefined ? { sort } : {}),
          ...(order !== undefined ? { order } : {}),
          ...(fields !== undefined ? { fields } : {}),
          ...(withOwner !== undefined ? { withOwner } : {}),
          ...(withSupply !== undefined ? { withSupply } : {}),
          ...(withScamInfo !== undefined ? { withScamInfo } : {})
        }),
    ...(search !== undefined ? { search } : {}),
    ...(identifiers !== undefined ? { identifiers } : {}),
    ...(type !== undefined ? { type } : {}),
    ...(collections !== undefined ? { collections } : {}),
    ...(name !== undefined ? { name } : {}),
    ...(tags !== undefined ? { tags } : {}),
    ...(creator !== undefined ? { creator } : {}),
    ...(source !== undefined ? { source } : {}),
    ...(hasUris !== undefined ? { hasUris } : {}),
    ...(includeFlagged !== undefined ? { includeFlagged } : {}),
    ...(excludeMetaESDT !== undefined ? { excludeMetaESDT } : {})
  };

  return params;
}

export const getShardAndEpochParams = (
  shard: string | number | undefined,
  epoch: string | number | undefined
) => {
  let result = {};

  if (shard !== undefined) {
    result = { ...result, shard };
  }

  if (epoch !== undefined) {
    result = { ...result, epoch };
  }

  return result;
};

export function processBlocks(blocks: any[]) {
  let min = blocks && blocks.length > 0 ? blocks[0].nonce : 0;
  let max = min;
  for (const block in blocks) {
    // tslint:disable-line
    if (blocks[block].nonce < min) {
      min = blocks[block].nonce;
    }

    if (blocks[block].nonce > max) {
      max = blocks[block].nonce;
    }
  }

  const startBlockNr = min;
  const endBlockNr = max;

  return {
    blocks,
    startBlockNr,
    endBlockNr
  };
}

export const getPageParams = ({ page = 1, size = PAGE_SIZE }: BaseApiType) => {
  const from = new BigNumber(page).minus(1).times(size);
  const isMoreThanMax = from.plus(size).isGreaterThan(MAX_RESULTS);

  if (isMoreThanMax) {
    return {
      from: from.toNumber(),
      size: new BigNumber(MAX_RESULTS).minus(from).toNumber()
    };
  }

  return {
    from: from.toNumber(),
    size
  };
};
