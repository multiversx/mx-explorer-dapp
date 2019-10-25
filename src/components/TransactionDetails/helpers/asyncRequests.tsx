export async function getTransaction(elasticUrl: string, transactionId: string) {
  try {
    const response = await fetch(`${elasticUrl}/transactions/_doc/${transactionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    let data = await response.json();

    return data._source || {};
  } catch {
    return {};
  }
}
