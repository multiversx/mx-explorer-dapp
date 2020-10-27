import { AdapterFunctionType } from './index';

const getShardOrEpochParam = (shardId: number | undefined, epoch: number | undefined) => {
  switch (true) {
    case shardId !== undefined:
      return { shardId };
    case epoch !== undefined:
      return { epoch };
    default:
      return {};
  }
};

export interface GetBlocksParamsType {
  size?: number;
  shardId: number | undefined;
  epochId?: number;
}

export async function getBlocks({
  provider,
  baseUrl,
  size = 1,
  shardId,
  timeout,
  epochId,
}: AdapterFunctionType & GetBlocksParamsType) {
  try {
    const params = {
      from: (size - 1) * 25,
      size: 25,
      ...getShardOrEpochParam(shardId, epochId),
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
      blocksFetched: true,
    };
  } catch (err) {
    return {
      blocks: [],
      startBlockNr: 0,
      endBlockNr: 0,
      blocksFetched: false,
    };
  }
}

export async function getBlocksCount({
  provider,
  baseUrl,
  shardId,
  timeout,
  epochId,
}: AdapterFunctionType & GetBlocksParamsType) {
  try {
    const params: AdapterFunctionType['params'] = {
      ...getShardOrEpochParam(shardId, epochId),
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
