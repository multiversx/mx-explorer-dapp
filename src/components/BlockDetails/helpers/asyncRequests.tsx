import axios from 'axios';
import { initialState } from './../index';

type GetBlocksType = {
  elasticUrl: string;
  timeout: number;
  blockId?: string;
};

async function searchCall({ elasticUrl, timeout }: GetBlocksType) {
  try {
    const {
      data: {
        hits: { hits },
      },
    } = await axios.get(`${elasticUrl}/validators/_search`, { timeout });
    return hits;
  } catch {
    return [];
  }
}

type GetNextBlockType = {
  currentBlockId: number;
  currentShardId: number;
  elasticUrl: string;
  timeout: number;
};

async function getNextBlock({
  elasticUrl,
  currentBlockId,
  currentShardId,
  timeout,
}: GetNextBlockType) {
  const nextBlockId = currentBlockId + 1;
  try {
    const {
      data: {
        hits: { hits },
      },
    } = await axios.post(
      `${elasticUrl}/blocks/_search`,
      {
        query: {
          bool: {
            must: [{ match: { nonce: nextBlockId } }, { match: { shardId: currentShardId } }],
          },
        },
      },
      { timeout }
    );
    if (hits.length === 1) {
      return hits[0]._source.hash;
    }
    return '';
  } catch {
    return '';
  }
}

export async function getBlock({ elasticUrl, timeout, blockId = '' }: GetBlocksType) {
  try {
    const { data } = await axios.get(`${elasticUrl}/blocks/_doc/${blockId}`, { timeout });
    const block = data._source;

    const hits = await searchCall({ elasticUrl, timeout });

    const consensusArray = hits.length
      ? hits.filter((hit: any) => hit['_id'] === block.shardId.toString()).pop()['_source']
          .publicKeys
      : [];

    const consensusItems = consensusArray.length
      ? block.validators.map((id: any) => consensusArray[id])
      : [];

    const nextHash = await getNextBlock({
      elasticUrl,
      currentBlockId: block.nonce,
      currentShardId: block.shardId,
      timeout,
    });

    return {
      block,
      proposer: consensusItems.length ? [...consensusItems].shift() : '',
      consensusItems,
      nextHash,
      blockFetched: true,
    };
  } catch {
    return { ...initialState, blockFetched: false };
  }
}
