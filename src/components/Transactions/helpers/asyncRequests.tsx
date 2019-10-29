import axios from 'axios';

type ParamsType = {
  elasticUrl: string;
  size: number;
};

export async function getTransactions({ elasticUrl, size }: ParamsType) {
  try {
    const response = await axios.post(`${elasticUrl}/transactions/_search`, {
      query: { match_all: {} },
      sort: { timestamp: { order: 'desc' } },
      from: (size - 1) * 50,
      size: 50,
    });

    let data = 'hits' in response ? response : response.data;

    const transactionsArray = data.hits.hits.map((transaction: any) => transaction._source);

    return transactionsArray;
  } catch (err) {
    console.log('FAILING');
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
