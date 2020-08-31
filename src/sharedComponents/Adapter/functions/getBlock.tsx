import { AdapterFunctionType } from './index';

export interface BlockType {
  hash: string;
  nonce: number;
  epoch: number;
  prevHash: string;
  proposer: number;
  pubKeyBitmap: string;
  round: number;
  shardId: number;
  size: number;
  sizeTxs: number;
  stateRootHash: string;
  timestamp: number;
  txCount: number;
  validators: number[];
  miniBlocksHashes: string[];
  notarizedBlocksHashes: string[];
}

const emptyBlock: BlockType = {
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
};

export const initialState = {
  block: emptyBlock,
  proposer: '',
  consensusItems: [],
  nextHash: '',
  blockFetched: true,
};

interface SearchCallType {
  shardId: number;
  epoch: number;
  blockId?: string;
}

async function searchCall({
  provider,
  providerUrl,
  timeout,
  shardId,
  epoch,
}: AdapterFunctionType & SearchCallType) {
  try {
    const { data } = await provider({
      providerUrl,
      url: `/validators/${shardId}_${epoch}`,
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
}

async function getNextBlock({
  provider,
  providerUrl,
  currentBlockId,
  currentShardId,
  timeout,
}: AdapterFunctionType & GetNextBlockType) {
  const nextBlockId = currentBlockId + 1;
  try {
    const params = {
      nonce: nextBlockId,
      shardId: currentShardId,
    };

    const { data } = await provider({
      providerUrl,
      url: `/blocks`,
      params,
      timeout,
    });

    return data[0] ? data[0].id : '';
  } catch {
    return '';
  }
}

export default async function getBlock({
  provider,
  providerUrl,
  timeout,
  blockId = '',
}: AdapterFunctionType & { blockId: string }) {
  try {
    const { data } = await provider({
      providerUrl,
      url: `/blocks/${blockId}`,
      timeout,
    });

    const block = { hash: data.id, ...data };

    const hit = await searchCall({
      provider,
      providerUrl,
      timeout,
      shardId: block.shardId,
      epoch: block.epoch,
    });

    const consensusArray = Object.keys(hit).length ? hit.publicKeys : [];

    const consensusItems = consensusArray.length
      ? block.validators.map((id: any) => consensusArray[id])
      : [];

    const nextHash = await getNextBlock({
      provider,
      providerUrl,
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
