import { AdapterFunctionType } from './index';

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

export interface GetBlocksParamsType {
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
