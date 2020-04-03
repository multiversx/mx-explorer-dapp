import axios from 'axios';

interface GetBlocksType {
  elasticUrl: string;
  timeout: number;
}

export async function getBlocks({ elasticUrl, timeout }: GetBlocksType) {
  try {
    const {
      data: {
        hits: { hits },
      },
    } = await axios.post(
      `${elasticUrl}/blocks/_search`,
      {
        query: {
          match_all: {},
        },
        sort: {
          timestamp: {
            order: 'desc',
          },
        },
        size: 20,
      },
      { timeout }
    );

    const data = hits.map((block: any) => ({ hash: block._id, ...block._source }));

    return {
      data,
      blocksFetched: data.length > 0,
    };
  } catch {
    return {
      data: [],
      blocksFetched: false,
    };
  }
}

export async function getTransactions({ elasticUrl, timeout }: GetBlocksType) {
  try {
    const {
      data: {
        hits: { hits },
      },
    } = await axios.post(
      `${elasticUrl}/transactions/_search`,
      {
        query: {
          match_all: {},
        },
        sort: {
          timestamp: {
            order: 'desc',
          },
        },
        size: 20,
      },
      { timeout }
    );
    const data = hits.map((transaction: any) => ({
      hash: transaction._id,
      ...transaction._source,
    }));

    return {
      data,
      transactionsFetched: data.length > 0,
    };
  } catch {
    return {
      data: [],
      transactionsFetched: false,
    };
  }
}
