import axios from 'axios';

export interface GetBlocksParamsType {
  elasticUrl: string;
  size?: number;
  shardId: number | undefined;
  epochId: number | undefined;
  timeout: number;
}

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

export async function getBlocks({
  elasticUrl,
  size = 1,
  shardId,
  timeout,
  epochId,
}: GetBlocksParamsType) {
  try {
    const params = {
      from: (size - 1) * 25,
      size: 25,
      ...getShardOrEpochParam(shardId, epochId),
    };

    const { data } = await axios.get(`${elasticUrl}/blocks`, { params, timeout });
    const blocks = data.map((block: any) => ({ hash: block.id, ...block }));

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

export async function getTotalBlocks({
  elasticUrl,
  shardId,
  timeout,
  epochId,
}: GetBlocksParamsType) {
  try {
    const params = {
      ...getShardOrEpochParam(shardId, epochId),
    };

    const { data } = await axios.get(`${elasticUrl}/blocks/count`, { params, timeout });

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
