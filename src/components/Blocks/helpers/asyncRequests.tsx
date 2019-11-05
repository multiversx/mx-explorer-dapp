import axios from 'axios';

type ParamsType = {
  elasticUrl: string;
  size: number;
};

export async function getBlocks({ elasticUrl, size }: ParamsType) {
  try {
    const { data } = await axios.post(`${elasticUrl}/blocks/_search`, {
      query: { match_all: {} },
      sort: { timestamp: { order: 'desc' } },
      from: (size - 1) * 25,
      size: 25,
    });

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

export async function getTotalBlocks(elasticUrl: string) {
  try {
    const { data } = await axios.post(`${elasticUrl}/blocks/_count`, {
      query: { match_all: {} },
    });

    return data.count;
  } catch {
    return 0;
  }
}
