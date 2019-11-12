import axios from 'axios';

export type GetBlocksParamsType = {
  elasticUrl: string;
  size?: number;
  shardId: number | undefined;
  timeout: number;
};

const setShardsQuery = (shardId: number | undefined) =>
  shardId
    ? {
        query: {
          bool: {
            must: [{ match: { shardId } }],
          },
        },
      }
    : {
        query: { match_all: {} },
      };

export async function getBlocks({
  elasticUrl,
  size = 1,
  shardId = undefined,
  timeout,
}: GetBlocksParamsType) {
  try {
    const query = {
      sort: { timestamp: { order: 'desc' } },
      from: (size - 1) * 25,
      size: 25,
      ...setShardsQuery(shardId),
    };

    const { data } = await axios.post(`${elasticUrl}/blocks/_search`, query, { timeout });

    const { hits } = data;
    const blocks = hits.hits.map((block: any) => block._source);

    let min = blocks[0].nonce;
    let max = min;
    for (let block in blocks) {
      if (blocks[block].nonce < min) min = blocks[block].nonce;

      if (blocks[block].nonce > max) max = blocks[block].nonce;
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
  shardId = undefined,
  timeout,
}: GetBlocksParamsType) {
  try {
    const { data } = await axios.post(`${elasticUrl}/blocks/_count`, setShardsQuery(shardId), {
      timeout,
    });

    return data.count;
  } catch {
    return 0;
  }
}
