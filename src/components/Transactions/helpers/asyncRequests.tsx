import axios from 'axios';

type ParamsType = {
  elasticUrl: string;
  size: number;
};

//TODO: control asupra timeoutului, si daca e prea lung sa dam noi failed manual

export async function getTransactions({ elasticUrl, size }: ParamsType) {
  let data = [];
  try {
    const {
      data: { hits },
    } = await axios.post(`${elasticUrl}/transactions/_search`, {
      query: { match_all: {} },
      sort: { timestamp: { order: 'desc' } },
      from: (size - 1) * 50,
      size: 50,
    });

    data = hits.hits.map((entry: any) => entry._source);

    return {
      data,
      success: true,
    };
  } catch {
    return {
      data,
      success: false,
    };
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
