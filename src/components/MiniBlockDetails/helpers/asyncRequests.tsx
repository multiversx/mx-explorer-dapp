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
    const { data } = await axios.get(`${elasticUrl}/miniblocks/_doc/${miniBlockHash}`, { timeout });
    const miniBlock = { hash: data._id, ...data._source };

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
  let data = [];
  try {
    const {
      data: { hits },
    } = await axios.post(
      `${elasticUrl}/transactions/_search`,
      {
        sort: { timestamp: { order: 'desc' } },
        from: (size - 1) * 50,
        size: 50,
        query: {
          bool: {
            should: [{ match: { miniBlockHash: miniBlockHash } }],
          },
        },
      },
      { timeout }
    );

    data = hits.hits.map((entry: any) => ({ hash: entry._id, ...entry._source }));

    return {
      data,
      success: data.length > 0,
    };
  } catch {
    return {
      data,
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
    const {
      data: { count },
    } = await axios.post(
      `${elasticUrl}/transactions/_count`,
      {
        query: {
          bool: {
            should: [{ match: { miniBlockHash: miniBlockHash } }],
          },
        },
      },
      {
        timeout,
      }
    );

    return {
      count,
      success: true,
    };
  } catch {
    return {
      count: 0,
      success: false,
    };
  }
}
