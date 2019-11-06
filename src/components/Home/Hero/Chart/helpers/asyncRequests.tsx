import axios from 'axios';

type TransactionsCountType = {
  elasticUrl: string;
  start: number;
  end: number;
};

export async function getLastTransactionsCount({ elasticUrl, start, end }: TransactionsCountType) {
  try {
    const {
      data: { count },
    } = await axios.post(`${elasticUrl}/transactions/_count`, {
      query: {
        bool: {
          filter: {
            range: {
              timestamp: {
                gt: start,
                lt: end,
              },
            },
          },
        },
      },
    });

    return {
      count,
      countFetched: true,
    };
  } catch {
    return {
      count: 0,
      countFetched: false,
    };
  }
}
