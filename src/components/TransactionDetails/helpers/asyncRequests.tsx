import axios from 'axios';

export async function getTransaction(elasticUrl: string, transactionId: string) {
  try {
    const { data } = await axios.get(`${elasticUrl}/transactions/_doc/${transactionId}`);

    return data._source;
  } catch {
    return {};
  }
}
