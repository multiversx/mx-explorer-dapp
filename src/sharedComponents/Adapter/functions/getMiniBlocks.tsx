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
  baseUrl,
  timeout,
  miniBlockHash = '',
  provider,
}: AdapterFunctionType & { miniBlockHash: string }) {
  try {
    const { data } = await provider({
      baseUrl,
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
  baseUrl,
  timeout,
  miniBlockHash = '',
  size = 1,
}: MiniBlockType & { size: number }) {
  try {
    let { data } = await provider({
      baseUrl,
      params: {
        from: (size - 1) * 50,
        size: 50,
        miniBlockHash,
      },
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
  baseUrl,
  timeout,
  miniBlockHash = '',
}: MiniBlockType) {
  try {
    const { data } = await provider({
      baseUrl,
      params: {
        miniBlockHash,
      },
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
