import axios from 'axios';

export const initialState = {
  block: {
    hash: '',
    nonce: 0,
    epoch: 0,
    prevHash: '',
    proposer: 0,
    pubKeyBitmap: '',
    round: 0,
    shardId: 0,
    size: 0,
    sizeTxs: 0,
    stateRootHash: '',
    timestamp: 0,
    txCount: 0,
    validators: [],
    miniBlocksHashes: [],
    notarizedBlocksHashes: [],
  },
  proposer: '',
  consensusItems: [],
  nextHash: '',
  blockFetched: true,
};

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
    const { data } = await axios.get(`${elasticUrl}/validators/${shardId}_${epoch}`, {
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
    const params = {
      nonce: nextBlockId,
      shardId: currentShardId,
    };

    const { data } = await axios.get(`${elasticUrl}/blocks`, { params, timeout });

    return data[0] ? data[0].id : '';
  } catch {
    return '';
  }
}

export async function getBlock({ elasticUrl, timeout, blockId = '' }: GetBlocksType) {
  try {
    const { data } = await axios.get(`${elasticUrl}/blocks/${blockId}`, { timeout });
    const block = { hash: data.id, ...data };

    const hit = await searchCall({
      elasticUrl,
      timeout,
      shardId: block.shardId,
      epoch: block.epoch,
    });

    const consensusArray = Object.keys(hit).length ? hit.publicKeys : [];

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
