import axios from 'axios';
import { AdapterFunctionType } from './index';

export async function getTransaction({
  provider,
  baseUrl,
  timeout,
  transactionId,
}: AdapterFunctionType & { transactionId: string }) {
  const { data } = await provider({
    baseUrl,
    url: `/transactions/${transactionId}`,
    timeout,
  });

  return {
    data: { hash: data.id, ...data },
    transactionFetched: true,
  };
}

interface GetTransactionsType {
  proxyUrl: string;
  timeout: number;
  transactionId: string;
}

export async function getPendingTransaction({
  transactionId,
  timeout,
  proxyUrl,
}: GetTransactionsType) {
  try {
    const {
      data: {
        data: { transaction },
        code,
        error,
      },
    } = await axios.get(`${proxyUrl}/transaction/${transactionId}`, { timeout });

    if (code === 'successful') {
      return {
        data: { hash: transactionId, ...transaction },
        transactionFetched: true,
      };
    } else {
      throw new Error(error);
    }
  } catch {
    return {
      data: {},
      transactionFetched: false,
    };
  }
}
