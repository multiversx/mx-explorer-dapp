export async function getTransactions(elasticUrl: string) {
  const response = await fetch(`${elasticUrl}/transactions/_search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: { match_all: {} },
      sort: { timestamp: { order: 'desc' } },
      from: 0,
      size: 50,
    }),
  });

  let data = await response.json();

  return data;
}
