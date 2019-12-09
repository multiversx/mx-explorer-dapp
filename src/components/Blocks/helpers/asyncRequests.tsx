import axios from 'axios';

export interface GetBlocksParamsType {
  elasticUrl: string;
  size?: number;
  shardId: number | undefined;
  timeout: number;
}

const setShardsQuery = (shardId: number | undefined) =>
  shardId !== undefined
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

export async function getBlocks({ elasticUrl, size = 1, shardId, timeout }: GetBlocksParamsType) {
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
    for (const block in blocks) {
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

export async function getTotalBlocks({ elasticUrl, shardId, timeout }: GetBlocksParamsType) {
  try {
    const {
      data: { count },
    } = await axios.post(`${elasticUrl}/blocks/_count`, setShardsQuery(shardId), {
      timeout,
    });

    return {
      count,
      success: true,
    };
  } catch {
    return {
      count: 0,
      success: false,
    };
  }
}
