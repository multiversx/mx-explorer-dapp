type ParamsType = {
  elasticUrl: string;
  size: number;
};

export async function getTransactions({ elasticUrl, size }: ParamsType) {
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

  return data;
}
