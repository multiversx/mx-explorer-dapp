import axios from 'axios';

type TransactionsCountType = {
  elasticUrl: string;
  start: number;
  end: number;
  timeout: number;
};

export async function getLastTransactionsCount({
  elasticUrl,
  start,
  end,
  timeout,
}: TransactionsCountType) {
  try {
    const {
      data: { count },
    } = await axios.post(
      `${elasticUrl}/transactions/_count`,
      {
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
      },
      { timeout }
    );

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
