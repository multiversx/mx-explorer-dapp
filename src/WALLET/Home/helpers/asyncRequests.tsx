import axios from 'axios';

interface DetailsType {
  nodeUrl: string;
  publicKey: string;
  timeout: number;
}

export async function getWalletDetails({ nodeUrl, publicKey, timeout }: DetailsType) {
  try {
    const {
      data: {
        account: { balance, nonce },
      },
    } = await axios.get(`${nodeUrl}/address/${publicKey}`, { timeout });

    return {
      balance,
      nonce,
      detailsFetched: true,
    };
  } catch (err) {
    console.error(err);
    return {
      balance: '',
      nonce: 0,
      detailsFetched: false,
    };
  }
}
export async function getTokens({ nodeUrl, publicKey, timeout }: DetailsType) {
  try {
    const data = await axios.post(
      `${nodeUrl}/transaction/send-user-funds`,
      {
        receiver: publicKey,
      },
      { timeout }
    );

    return Boolean(data);
  } catch (err) {
    console.error(err);
    return false;
  }
}

interface GetLatestTransactionsType {
  elasticUrl: string;
  publicKey: string;
  timeout: number;
}

export async function getLatestTransactions({
  elasticUrl,
  publicKey,
  timeout,
}: GetLatestTransactionsType) {
  try {
    const {
      data: {
        hits: { hits },
      },
    } = await axios.post(
      `${elasticUrl}/transactions/_search`,
      {
        query: {
          bool: {
            should: [{ match: { sender: publicKey } }, { match: { receiver: publicKey } }],
          },
        },
        sort: {
          timestamp: {
            order: 'desc',
          },
        },
        size: 15,
      },
      { timeout }
    );

    return {
      transactions: hits.map((transaction: any) => ({
        hash: transaction._id,
        ...transaction._source,
      })),
      success: true,
    };
  } catch (err) {
    return {
      transactions: [],
      success: false,
    };
  }
}

interface SendTransactionType {
  nodeUrl: string;
  transaction: object;
  timeout: number;
  nonce: number;
}

export async function sendTransaction({ nodeUrl, transaction, timeout }: SendTransactionType) {
  try {
    const {
      data: { txHash },
      status,
    } = await axios.post(`${nodeUrl}/transaction/send`, transaction, {
      timeout,
    });

    if (status === 200) {
      return {
        lastTxHash: txHash,
        success: true,
      };
    }
    return {
      lastTxHash: '',
      success: false,
    };
  } catch (err) {
    console.error(err);
    return {
      lastTxHash: '',
      success: false,
    };
  }
}
