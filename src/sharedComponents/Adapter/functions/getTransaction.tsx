import { AdapterFunctionType } from './index';

export async function getTransaction({
  provider,
  baseUrl,
  timeout,
  transactionId,
}: AdapterFunctionType & { transactionId: string }) {
  try {
    const { data } = await provider({
      baseUrl,
      url: `/transactions/${transactionId}`,
      timeout,
    });

    return {
      data,
      success: Boolean(data),
    };
  } catch (err) {
    return {
      success: false,
    };
  }
}
