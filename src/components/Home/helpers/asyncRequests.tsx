import axios from 'axios';

export async function getBlocks(elasticUrl: string) {
  try {
    const {
      data: {
        hits: { hits },
      },
    } = await axios.post(`${elasticUrl}/blocks/_search`, {
      query: {
        match_all: {},
      },
      sort: {
        timestamp: {
          order: 'desc',
        },
      },
      size: 20,
    });
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

export async function getTransactions(elasticUrl: string) {
  try {
    const {
      data: {
        hits: { hits },
      },
    } = await axios.post(`${elasticUrl}/transactions/_search`, {
      query: {
        match_all: {},
      },
      sort: {
        timestamp: {
          order: 'desc',
        },
      },
      size: 20,
    });
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
