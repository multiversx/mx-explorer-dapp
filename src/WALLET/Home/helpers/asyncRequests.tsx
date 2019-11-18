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
    return {
      balance: '',
      nonce: '',
      detailsFetched: true,
    };
  }
}
