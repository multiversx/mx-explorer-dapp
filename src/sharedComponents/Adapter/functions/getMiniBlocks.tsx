import { AdapterFunctionType } from './index';

export const initialState = {
  miniBlock: {
    senderShard: 0,
    receiverShard: 0,
    senderBlockHash: '',
    receiverBlockHash: '',
    type: '',
    hash: '',
  },
  blockFetched: true,
};

export async function getMiniBlock({
  elasticUrl,
  timeout,
  miniBlockHash = '',
  provider,
}: AdapterFunctionType & { miniBlockHash: string }) {
  try {
    const { data } = await provider({
      elasticUrl,
      url: `/miniblocks/${miniBlockHash}`,
      timeout,
    });
    const miniBlock = { hash: data.id, ...data };

    return {
      miniBlock,
      blockFetched: true,
    };
  } catch {
    return { ...initialState, blockFetched: false };
  }
}

type MiniBlockType = AdapterFunctionType & { miniBlockHash: string };

export async function getMiniBlockTransactions({
  provider,
  elasticUrl,
  timeout,
  miniBlockHash = '',
  size = 1,
}: MiniBlockType & { size: number }) {
  try {
    const params = {
      from: (size - 1) * 50,
      size: 50,
      miniBlockHash,
    };

    let { data } = await provider({
      elasticUrl,
      params,
      url: `/transactions`,
      timeout,
    });

    data = data.map((transaction: any) => ({ hash: transaction.id, ...transaction }));

    return {
      data,
      success: data.length > 0,
    };
  } catch {
    return {
      data: [],
      success: false,
    };
  }
}

export async function getMiniBlockTransactionsCount({
  provider,
  elasticUrl,
  timeout,
  miniBlockHash = '',
}: MiniBlockType) {
  try {
    const params = {
      miniBlockHash,
    };

    const { data } = await provider({
      elasticUrl,
      params,
      url: `/transactions/count`,
      timeout,
    });

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
