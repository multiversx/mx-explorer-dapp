import axios from 'axios';

type DetailsType = {
  nodeUrl: string;
  publicKey: string;
  timeout: number;
};

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
      nonce: '',
      detailsFetched: true,
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
