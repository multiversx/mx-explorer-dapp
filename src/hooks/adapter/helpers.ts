import { PAGE_SIZE } from 'appConstants';
import {
  AdapterProviderPropsType,
  GetTransactionsType,
  GetNodesType,
  GetProvidersType,
  GetTokensType,
  GetNftsType
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
  address = '',
  size = 1,
  senderShard,
  receiverShard,
  sender,
  receiver,
  method,
  before,
  after,
  status,
  miniBlockHash,
  search,
  withUsername
}: GetTransactionsType) {
  const params: AdapterProviderPropsType['params'] = {
    from: (size - 1) * PAGE_SIZE,
    size: PAGE_SIZE,
    ...getAccountParams(address),
    ...(senderShard !== undefined ? { senderShard } : {}),
    ...(receiverShard !== undefined ? { receiverShard } : {}),
    ...(sender ? { sender } : {}),
    ...(receiver ? { receiver } : {}),
    ...(method ? { function: method } : {}),
    ...(before ? { before } : {}),
    ...(after ? { after } : {}),
    ...(status ? { status } : {}),
    ...(miniBlockHash ? { miniBlockHash } : {}),
    ...(search ? { search } : {}),
    ...(withUsername !== undefined ? { withUsername } : {})
  };

  return params;
}

export function getNodeParams({
  type,
  status,
  issues,
  search,
  shard,
  online,
  size,
  identity,
  pagination = true,
  sort,
  order,
  provider,
  fullHistory
}: GetNodesType) {
  const params: AdapterProviderPropsType['params'] = {
    ...(search !== undefined ? { search } : {}),
    ...(type !== undefined ? { type } : {}),
    ...(status !== undefined ? { status } : {}),
    ...(issues !== undefined ? { issues } : {}),
    ...(shard !== undefined ? { shard: parseInt(shard) } : {}),
    ...(online !== undefined ? { online } : {}),
    ...(identity !== undefined ? { identity } : {}),
    ...(provider !== undefined ? { provider } : {}),
    ...(sort !== undefined ? { sort } : {}),
    ...(order !== undefined ? { order } : {}),
    ...(fullHistory !== undefined ? { fullHistory } : {}),
    ...(size !== undefined
      ? pagination
        ? { from: (size - 1) * PAGE_SIZE, size: PAGE_SIZE }
        : { size }
      : {})
  };

  return params;
}

export function getProviderParams({ identity, providers }: GetProvidersType) {
  const params: AdapterProviderPropsType['params'] = {
    ...(identity !== undefined ? { identity } : {}),
    ...(providers !== undefined ? { providers } : {})
  };
  return params;
}

export function getTokensParams({
  size,
  type,
  search,
  name,
  identifier,
  identifiers,
  sort,
  order,
  withUsername,
  includeMetaESDT
}: GetTokensType) {
  const params: AdapterProviderPropsType['params'] = {
    ...(type !== undefined ? { type } : {}),
    ...(search !== undefined ? { search } : {}),
    ...(name !== undefined ? { name } : {}),
    ...(identifier !== undefined ? { identifier } : {}),
    ...(identifiers !== undefined ? { identifiers } : {}),
    ...(sort !== undefined ? { sort } : {}),
    ...(order !== undefined ? { order } : {}),
    ...(withUsername !== undefined ? { withUsername } : {}),
    ...(includeMetaESDT !== undefined ? { includeMetaESDT } : {}),
    ...(size !== undefined
      ? { from: (size - 1) * PAGE_SIZE, size: PAGE_SIZE }
      : {})
  };

  return params;
}

export function getNftsParams({
  size,
  search,
  identifiers,
  type,
  collections,
  name,
  tags,
  creator,
  hasUris,
  includeFlagged,
  withSupply,
  withScamInfo,
  excludeMetaESDT,
  source
}: GetNftsType) {
  const params: AdapterProviderPropsType['params'] = {
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
    ...(withSupply !== undefined ? { withSupply } : {}),
    ...(withScamInfo !== undefined ? { withScamInfo } : {}),
    ...(excludeMetaESDT !== undefined ? { excludeMetaESDT } : {}),
    ...(size !== undefined
      ? { from: (size - 1) * PAGE_SIZE, size: PAGE_SIZE }
      : {})
  };

  return params;
}

export const getShardAndEpochParams = (
  shard: number | undefined,
  epoch: number | undefined
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