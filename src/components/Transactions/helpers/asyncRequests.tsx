import axios from 'axios';

type ParamsType = {
  elasticUrl: string;
  size: number;
};

export async function getTransactions({ elasticUrl, size }: ParamsType) {
  try {
    const { data } = await axios.post(`${elasticUrl}/transactions/_search`, {
      query: { match_all: {} },
      sort: { timestamp: { order: 'desc' } },
      from: (size - 1) * 50,
      size: 50,
    });

    const transactionsArray = data.hits.hits.map((transaction: any) => transaction._source);

    return transactionsArray;
  } catch {
    return [];
  }
}

export async function getTotalTransactions(elasticUrl: string) {
  try {
    const { data } = await axios.post(`${elasticUrl}/transactions/_count`, {
      query: { match_all: {} },
    });

    return data.count;
  } catch {
    return 0;
  }
}
