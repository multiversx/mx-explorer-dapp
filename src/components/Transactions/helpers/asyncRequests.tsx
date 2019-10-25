type ParamsType = {
  elasticUrl: string;
  size: number;
};

export async function getTransactions({ elasticUrl, size }: ParamsType) {
  try {
    const response = await fetch(`${elasticUrl}/transactions/_search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: { match_all: {} },
        sort: { timestamp: { order: 'desc' } },
        from: (size - 1) * 50,
        size: 50,
      }),
    });

    let data = await response.json();
    const transactionsArray = data.hits.hits.map((transaction: any) => transaction._source);

    return transactionsArray;
  } catch {
    return [];
  }
}

export async function getTotalTransactions(elasticUrl: string) {
  try {
    const response = await fetch(`${elasticUrl}/transactions/_count`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: { match_all: {} },
      }),
    });

    let data = await response.json();
    return data.count;
  } catch {
    return 0;
  }
}
