import axios from 'axios';

type GetBlocksType = {
  elasticUrl: string;
  timeout: number;
};

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

    return {
      data: hits.map((block: any) => block._source),
      blocksFetched: true,
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
    return {
      data: hits.map((transaction: any) => transaction._source),
      transactionsFetched: true,
    };
  } catch {
    return {
      data: [],
      transactionsFetched: false,
    };
  }
}
