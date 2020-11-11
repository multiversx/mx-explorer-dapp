import { AdapterFunctionType } from './index';

const getShardOrEpochParam = (shard: number | undefined, epoch: number | undefined) => {
  switch (true) {
    case shard !== undefined:
      return { shard };
    case epoch !== undefined:
      return { epoch };
    default:
      return {};
  }
};

export interface GetBlocksParamsType {
  size?: number;
  shard?: number;
  epochId?: number;
  proposer?: string;
}

export async function getBlocks({
  provider,
  baseUrl,
  size = 1,
  shard,
  timeout,
  epochId,
  proposer,
}: AdapterFunctionType & GetBlocksParamsType) {
  try {
    const params = {
      from: (size - 1) * 25,
      size: 25,
      ...(proposer ? { proposer } : {}),
      ...getShardOrEpochParam(shard, epochId),
      fields: ['hash', 'nonce', 'shardId', 'size', 'sizeTxs', 'timestamp', 'txCount'].join(','),
    };

    const { data: blocks } = await provider({
      baseUrl,
      url: `/blocks`,
      params,
      timeout,
    });

    let min = blocks[0].nonce;
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
      success: true,
    };
  } catch (err) {
    return {
      success: false,
    };
  }
}

export async function getBlocksCount({
  provider,
  baseUrl,
  shard,
  timeout,
  epochId,
}: AdapterFunctionType & GetBlocksParamsType) {
  try {
    const params: AdapterFunctionType['params'] = {
      ...getShardOrEpochParam(shard, epochId),
    };

    const { data } = await provider({
      baseUrl,
      url: `/blocks/count`,
      params,
      timeout,
    });

    return {
      count: data,
      success: true,
    };
  } catch {
    return {
      count: 0,
      success: false,
    };
  }
}
