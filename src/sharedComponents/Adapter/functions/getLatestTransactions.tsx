import { AdapterFunctionType } from './index';

export default async function getLatestTransactions({
  provider,
  providerUrl,
  timeout,
}: AdapterFunctionType) {
  try {
    const params = {
      size: 20,
    };

    const { data } = await provider({
      providerUrl,
      url: `/transactions`,
      params,
      timeout,
    });

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
