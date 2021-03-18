export interface GetNodesType {
  search?: string;
  issues?: string;
  peerType?: string;
  nodeType?: string;
  shard?: string;
  status?: string;
  count?: boolean;
  size?: number;
  identity?: string;
  sort?: string;
  order?: string;
  pagination?: boolean;
  provider?: string;
}

export interface GetProvidersType {
  identity?: string;
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
    peerType?: string;
    nodeType?: string;
    status?: string;
    validator?: string;
    fields?: any;
    identity?: string;
    provider?: string;
    sort?: string;
    order?: string;
  };
  timeout: number;
}

export const getAccountParams = (address?: string) =>
  address
    ? {
        sender: address,
        receiver: address,
        condition: 'should',
      }
    : {};

export interface TransactionsParamsType {
  size?: number;
  address?: string;
  senderShard?: number;
  receiverShard?: number;
}

export function getTransactionsParams({
  address = '',
  size = 1,
  senderShard,
  receiverShard,
}: TransactionsParamsType) {
  const params: ProviderPropsType['params'] = {
    from: (size - 1) * 25,
    size: 25,
    ...getAccountParams(address),
    ...(senderShard !== undefined ? { senderShard } : {}),
    ...(receiverShard !== undefined ? { receiverShard } : {}),
    ...{
      fields: [
        'txHash',
        'receiver',
        'receiverShard',
        'sender',
        'senderShard',
        'status',
        'timestamp',
        'value',
      ].join(','),
    },
  };

  return params;
}

export function getNodeParams({
  peerType,
  issues,
  search,
  nodeType,
  shard,
  status,
  size,
  identity,
  pagination = true,
  sort,
  order,
  provider,
}: GetNodesType) {
  const params: ProviderPropsType['params'] = {
    ...(search !== undefined ? { search } : {}),
    ...(peerType !== undefined ? { peerType } : {}),
    ...(issues !== undefined ? { issues } : {}),
    ...(nodeType !== undefined ? { nodeType } : {}),
    ...(shard !== undefined ? { shard: parseInt(shard) } : {}),
    ...(status !== undefined ? { status } : {}),
    ...(identity !== undefined ? { identity } : {}),
    ...(provider !== undefined ? { provider } : {}),
    ...(sort !== undefined ? { sort } : {}),
    ...(order !== undefined ? { order } : {}),
    ...(size !== undefined ? (pagination ? { from: (size - 1) * 25, size: 25 } : { size }) : {}),
  };

  return params;
}

export function getProviderParams({ identity }: GetProvidersType) {
  const params: ProviderPropsType['params'] = {
    ...(identity !== undefined ? { identity } : {}),
  };

  return params;
}

export const getShardOrEpochParam = (shard: number | undefined, epoch: number | undefined) => {
  switch (true) {
    case shard !== undefined:
      return { shard };
    case epoch !== undefined:
      return { epoch };
    default:
      return {};
  }
};

export interface GetBlocksType {
  size?: number;
  shard?: number;
  epochId?: number;
  proposer?: string;
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
    endBlockNr,
  };
}

export type ProviderType = (props: ProviderPropsType & { url: string }) => Promise<any>;
