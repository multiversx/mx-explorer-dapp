import axios from 'axios';

type ParamsType = {
  elasticUrl: string;
  size: number;
};

export async function getBlocks({ elasticUrl, size }: ParamsType) {
  try {
    const { data } = await axios.post(`${elasticUrl}/blocks/_search`, {
      query: { match_all: {} },
      sort: { timestamp: { order: 'desc' } },
      from: (size - 1) * 25,
      size: 25,
    });

    const resultsArray = data.hits.hits.map((entry: any) => entry._source);

    return resultsArray;
  } catch (err) {
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
