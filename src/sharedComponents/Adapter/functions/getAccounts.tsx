import { AdapterFunctionType } from './index';

export interface GetAccountsParamsType {
  size?: number;
}

export async function getAccounts({
  provider,
  baseUrl,
  size = 1,
  timeout,
}: AdapterFunctionType & GetAccountsParamsType) {
  try {
    const params = {
      from: (size - 1) * 25,
      size: 25,
    };

    const { data } = await provider({
      baseUrl,
      url: `/accounts`,
      params,
      timeout,
    });

    return {
      data,
      success: data !== undefined,
    };
  } catch (err) {
    return {
      success: false,
    };
  }
}

export async function getAccountsCount({
  provider,
  baseUrl,
  timeout,
}: AdapterFunctionType & GetAccountsParamsType) {
  try {
    const { data } = await provider({
      baseUrl,
      url: `/accounts/count`,
      timeout,
    });

    return {
      count: data,
      success: true,
    };
  } catch {
    return {
      count: 0,
      success: false,
    };
  }
}
