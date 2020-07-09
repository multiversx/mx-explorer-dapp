import axios from 'axios';

interface GetBlocksType {
  elasticUrl: string;
  timeout: number;
}

export async function getBlocks({ elasticUrl, timeout }: GetBlocksType) {
  try {
    const params = {
      size: 25,
    };

    const { data } = await axios.get(`${elasticUrl}/blocks`, { params, timeout });
    const blocks = data.map((block: any) => ({ hash: block.id, ...block }));

    return {
      data: blocks,
      blocksFetched: data.length > 0,
    };
  } catch {
    return {
      data: [],
      blocksFetched: false,
    };
  }
}

export async function getTransactions({ elasticUrl, timeout }: GetBlocksType) {
  try {
    const params = {
      size: 20,
    };
    const { data } = await axios.get(`${elasticUrl}/transactions`, { params, timeout });

    const transactions = data.map((transaction: any) => ({
      hash: transaction.id,
      ...transaction,
    }));

    return {
      data: transactions,
      transactionsFetched: data.length > 0,
    };
  } catch (e) {
    return {
      data: [],
      transactionsFetched: false,
    };
  }
}
