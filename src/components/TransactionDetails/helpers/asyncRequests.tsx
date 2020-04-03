import axios from 'axios';

interface GetTransactionsType {
  elasticUrl: string;
  timeout: number;
  transactionId: string;
}

export async function getTransaction({ elasticUrl, transactionId, timeout }: GetTransactionsType) {
  try {
    const {
      data: { _id, _source },
    } = await axios.get(`${elasticUrl}/transactions/_doc/${transactionId}`, { timeout });

    return {
      data: { hash: _id, ..._source },
      transactionFetched: true,
    };
  } catch {
    return {
      data: {},
      transactionFetched: false,
    };
  }
}
