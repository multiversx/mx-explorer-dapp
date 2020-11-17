import { AdapterFunctionType } from './index';

export interface GetAddressesParamsType {
  size?: number;
}

export async function getAddresses({
  provider,
  baseUrl,
  size = 1,
  timeout,
}: AdapterFunctionType & GetAddressesParamsType) {
  try {
    const params = {
      from: (size - 1) * 25,
      size: 25,
    };

    // fields: ['hash', 'nonce', 'shard', 'size', 'sizeTxs', 'timestamp', 'txCount'].join(','),

    const { data } = await provider({
      baseUrl,
      url: `/addresses`,
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

export async function getAddressesCount({
  provider,
  baseUrl,
  timeout,
}: AdapterFunctionType & GetAddressesParamsType) {
  try {
    const { data } = await provider({
      baseUrl,
      url: `/addresses/count`,
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
