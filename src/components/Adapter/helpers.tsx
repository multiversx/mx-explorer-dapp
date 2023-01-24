import { PAGE_SIZE } from 'appConstants';

export interface GetNodesType {
  search?: string;
  issues?: string;
  online?: boolean;
  type?: string;
  shard?: string;
  status?: string;
  count?: boolean;
  size?: number;
  identity?: string;
  sort?: string;
  order?: string;
  pagination?: boolean;
  provider?: string;
  fullHistory?: string;
}

export interface GetProvidersType {
  identity?: string;
  providers?: string;
  fields?: string;
}

export interface ProviderPropsType {
  baseUrl: string;
  proxyUrl?: string;
  metaChainShardId?: number;
  url?: string;
  params?: {
    nonce?: number;
    shard?: number;
    epoch?: number;
    proposer?: string;
    miniBlockHash?: string;
    sender?: string;
    receiver?: string;
    condition?: string;
    senderShard?: number;
    receiverShard?: number;
    signersIndexes?: number;
    round?: number;
    from?: number;
    size?: number;
    search?: string;
    issues?: string;
    status?: string;
    type?: string;
    validator?: string;
    fields?: any;
    identity?: string;
    identities?: string;
    provider?: string;
    sort?: string;
    order?: string;
    online?: boolean;
    collection?: string;
    identifier?: string;
    includeFlagged?: boolean;
    fullHistory?: string;
    withUsername?: boolean;
  };
  timeout: number;
  timestamp?: number;
}

export const getAccountParams = (address?: string) =>
  address
    ? {
        sender: address,
        receiver: address,
        condition: 'should'
      }
    : {};

export interface TransactionsParamsType {
  size?: number;
  address?: string;
  senderShard?: number;
  receiverShard?: number;
  sender?: string;
  receiver?: string;
  method?: string;
  before?: number;
  after?: number;
  status?: string;
  miniBlockHash?: string;
  search?: string;
  withUsername?: boolean;
}

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
}: TransactionsParamsType) {
  const params: ProviderPropsType['params'] = {
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
  const params: ProviderPropsType['params'] = {
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
  const params: ProviderPropsType['params'] = {
    ...(identity !== undefined ? { identity } : {}),
    ...(providers !== undefined ? { providers } : {})
  };
  return params;
}

export function getTokensParam({
  search,
  size,
  type,
  identifiers,
  sort,
  order,
  withUsername
}: GetTokensType) {
  const params: ProviderPropsType['params'] = {
    ...(search !== undefined ? { search } : {}),
    ...(type !== undefined ? { type } : {}),
    ...(identifiers !== undefined ? { identifiers } : {}),
    ...(sort !== undefined ? { sort } : {}),
    ...(order !== undefined ? { order } : {}),
    ...(withUsername !== undefined ? { withUsername } : {}),
    ...(size !== undefined
      ? { from: (size - 1) * PAGE_SIZE, size: PAGE_SIZE }
      : {})
  };

  return params;
}

export function getNftsParam({
  search,
  size,
  type,
  collection,
  identifiers,
  collections,
  includeFlagged
}: GetNftsType) {
  const params: ProviderPropsType['params'] = {
    ...(search !== undefined ? { search } : {}),
    ...(collection !== undefined ? { collection } : {}),
    ...(type !== undefined ? { type } : {}),
    ...(identifiers !== undefined ? { identifiers } : {}),
    ...(collections !== undefined ? { collections } : {}),
    ...(size !== undefined
      ? { from: (size - 1) * PAGE_SIZE, size: PAGE_SIZE }
      : {}),
    ...(includeFlagged !== undefined ? { includeFlagged } : {})
  };

  return params;
}

export const getShardAndEpochParam = (
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

export interface GetBlocksType {
  size?: number;
  shard?: number;
  epoch?: number;
  proposer?: string;
  withProposerIdentity?: boolean;
}

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

export type ProviderType = (
  props: ProviderPropsType & { url: string }
) => Promise<any>;

export interface GetTokensType {
  search?: string;
  size?: number;
  type?: string;
  identifiers?: string;
  sort?: string;
  order?: string;
  withUsername?: boolean;
}
export interface GetNftsType {
  collection?: string;
  identifier?: string;
  search?: string;
  size?: number;
  type?: string;
  collections?: string;
  identifiers?: string;
  includeFlagged?: boolean;
}
