import { AdapterFunctionType } from './index';

interface GetNextBlockType {
  currentBlockId: number;
  currentShardId: number;
}

async function getNextBlock({
  provider,
  baseUrl,
  currentBlockId,
  currentShardId,
  timeout,
}: AdapterFunctionType & GetNextBlockType) {
  const nextBlockId = currentBlockId + 1;
  try {
    const { data } = await provider({
      baseUrl,
      url: `/blocks`,
      params: {
        nonce: nextBlockId,
        shardId: currentShardId,
      },
      timeout,
    });

    return data[0] ? data[0].hash : '';
  } catch {
    return '';
  }
}

export default async function getBlock({
  provider,
  baseUrl,
  timeout,
  blockId = '',
}: AdapterFunctionType & { blockId: string }) {
  try {
    const { data: block } = await provider({
      baseUrl,
      url: `/blocks/${blockId}`,
      timeout,
    });

    const nextHash = await getNextBlock({
      provider,
      baseUrl,
      currentBlockId: block.nonce,
      currentShardId: block.shardId,
      timeout,
    });

    return {
      block,
      nextHash,
      success: true,
    };
  } catch {
    return { success: false };
  }
}
