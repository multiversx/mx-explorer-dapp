import { AdapterFunctionType } from './index';

export default async function getLatestTransactions({
  provider,
  baseUrl,
  timeout,
}: AdapterFunctionType) {
  try {
    const { data } = await provider({
      baseUrl,
      url: `/transactions`,
      params: {
        size: 20,
        ...{
          fields: [
            'txHash',
            'receiver',
            'receiverShard',
            'sender',
            'senderShard',
            'status',
            'timestamp',
            'value',
          ].join(','),
        },
      },
      timeout,
    });

    const transactions = data.map((transaction: any) => ({
      hash: transaction.id,
      ...transaction,
    }));

    return {
      data: transactions,
      transactionsFetched: true,
    };
  } catch (e) {
    return {
      data: [],
      transactionsFetched: false,
    };
  }
}
