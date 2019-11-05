import axios from 'axios';

export async function getTransaction(elasticUrl: string, transactionId: string) {
  try {
    const {
      data: { _source },
    } = await axios.get(`${elasticUrl}/transactions/_doc/${transactionId}`);

    return {
      data: _source,
      transactionFetched: true,
    };
  } catch {
    return {
      data: {},
      transactionFetched: false,
    };
  }
}
