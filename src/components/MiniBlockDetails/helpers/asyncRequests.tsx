import axios from 'axios';
import { initialState } from '../index';

interface GetMiniBlocksType {
  elasticUrl: string;
  timeout: number;
  miniBlockHash?: string;
}

interface ParamsType {
  elasticUrl: string;
  timeout: number;
  miniBlockHash?: string;
  size?: number;
}

export async function getMiniBlock({ elasticUrl, timeout, miniBlockHash = '' }: GetMiniBlocksType) {
  try {
    const { data } = await axios.get(`${elasticUrl}/miniblocks/${miniBlockHash}`, { timeout });
    const miniBlock = { hash: data.id, ...data };

    return {
      miniBlock,
      blockFetched: true,
    };
  } catch {
    return { ...initialState, blockFetched: false };
  }
}

export async function getTransactions({
  elasticUrl,
  timeout,
  miniBlockHash = '',
  size = 1,
}: ParamsType) {
  try {
    const params = {
      from: (size - 1) * 50,
      size: 50,
      miniBlockHash,
    };

    let { data } = await axios.get(`${elasticUrl}/transactions`, { params, timeout });
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

export async function getTotalTransactions({
  elasticUrl,
  timeout,
  miniBlockHash = '',
  size = 1,
}: ParamsType) {
  try {
    const params = {
      miniBlockHash,
    };

    const { data } = await axios.get(`${elasticUrl}/transactions/count`, { params, timeout });

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
