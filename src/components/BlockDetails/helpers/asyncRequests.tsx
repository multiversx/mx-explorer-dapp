import axios from 'axios';
import { initialState } from './../index';

async function searchCall(elasticUrl: string) {
  try {
    const {
      data: {
        hits: { hits },
      },
    } = await axios.get(`${elasticUrl}/validators/_search`);
    return hits;
  } catch {
    return [];
  }
}

type GetNextBlockType = {
  currentBlockId: number;
  currentShardId: number;
  elasticUrl: string;
};

async function getNextBlock({ elasticUrl, currentBlockId, currentShardId }: GetNextBlockType) {
  const nextBlockId = currentBlockId + 1;
  try {
    const {
      data: {
        hits: { hits },
      },
    } = await axios.post(`${elasticUrl}/blocks/_search`, {
      query: {
        bool: {
          must: [{ match: { nonce: nextBlockId } }, { match: { shardId: currentShardId } }],
        },
      },
    });
    if (hits.length === 1) {
      return hits[0]._source.hash;
    }
    return '';
  } catch {
    return '';
  }
}

export async function getTransaction(elasticUrl: string, blockId: string) {
  try {
    const { data } = await axios.get(`${elasticUrl}/blocks/_doc/${blockId}`);
    const block = data._source;

    const hits = await searchCall(elasticUrl);

    const {
      _source: { publicKeys: consensusArray },
    } = hits.filter((hit: any) => hit['_id'] === block.shardId.toString()).pop();

    const consensusItems = block.validators.map((id: any) => consensusArray[id]);

    const nextHash = await getNextBlock({
      elasticUrl,
      currentBlockId: block.nonce,
      currentShardId: block.shardId,
    });

    return {
      block,
      proposer: [...consensusItems].shift(),
      consensusItems,
      nextHash,
    };
  } catch {
    return initialState;
  }
}
