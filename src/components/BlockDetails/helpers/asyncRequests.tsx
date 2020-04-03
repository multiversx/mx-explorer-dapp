import axios from 'axios';
import { initialState } from './../index';

interface GetBlocksType {
  elasticUrl: string;
  timeout: number;
  blockId?: string;
}

interface SearchCallType {
  elasticUrl: string;
  timeout: number;
  shardId: number;
  epoch: number;
  blockId?: string;
}

async function searchCall({ elasticUrl, timeout, shardId, epoch }: SearchCallType) {
  try {
    const { data } = await axios.get(`${elasticUrl}/validators/_doc/${shardId}_${epoch}`, {
      timeout,
    });
    return data;
  } catch {
    return [];
  }
}

interface GetNextBlockType {
  currentBlockId: number;
  currentShardId: number;
  elasticUrl: string;
  timeout: number;
}

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

    if (hits[0]) {
      return hits[0]._id;
    }
    return '';
  } catch {
    return '';
  }
}

export async function getBlock({ elasticUrl, timeout, blockId = '' }: GetBlocksType) {
  try {
    const { data } = await axios.get(`${elasticUrl}/blocks/_doc/${blockId}`, { timeout });
    const block = { hash: data._id, ...data._source };

    const hit = await searchCall({
      elasticUrl,
      timeout,
      shardId: block.shardId,
      epoch: block.epoch,
    });

    const consensusArray = Object.keys(hit).length ? hit._source.publicKeys : [];

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
