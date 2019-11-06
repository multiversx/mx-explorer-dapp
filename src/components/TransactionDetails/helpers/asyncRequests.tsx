import axios from 'axios';

type GetTransactionsType = {
  elasticUrl: string;
  timeout: number;
  transactionId: string;
};

export async function getTransaction({ elasticUrl, transactionId, timeout }: GetTransactionsType) {
  try {
    const {
      data: { _source },
    } = await axios.get(`${elasticUrl}/transactions/_doc/${transactionId}`, { timeout });

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
