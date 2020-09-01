import axios from 'axios';
import { addressIsBech32 } from 'helpers';
import { AdapterFunctionType } from './index';

const getAddressParams = (addressId: string | undefined) =>
  addressId
    ? {
        sender: addressId,
        receiver: addressId,
      }
    : {};

const getShardTypeParams = (
  shardId: number | undefined,
  shardType: 'senderShard' | 'receiverShard' | undefined
) =>
  shardId && shardType
    ? {
        [shardType]: shardId,
      }
    : {};

export interface TransactionsType {
  size?: number;
  addressId?: string;
  shardType: 'senderShard' | 'receiverShard' | undefined;
  shardId: number | undefined;
}

export async function getTransactions({
  provider,
  baseUrl,
  timeout,
  addressId = '',
  size = 1,
  shardId,
  shardType,
}: AdapterFunctionType & TransactionsType) {
  const params: AdapterFunctionType['params'] = {
    from: (size - 1) * 50,
    size: 50,
    ...getAddressParams(addressId),
    ...getShardTypeParams(shardId, shardType),
  };

  try {
    let { data } = await provider({
      baseUrl,
      url: `/transactions`,
      params,
      timeout,
    });

    data = data.map((entry: any) => ({ hash: entry.id, ...entry }));

    return {
      data,
      success: data.length > 0,
    };
  } catch {
    return {
      data: [],
      success: false,
    };
  }
}

export async function getTransactionsCount({
  provider,
  baseUrl,
  addressId = '',
  shardId,
  shardType,
  timeout,
}: AdapterFunctionType & TransactionsType) {
  try {
    const params: AdapterFunctionType['params'] = {
      ...getAddressParams(addressId),
      ...getShardTypeParams(shardId, shardType),
    };

    const { data } = await provider({
      baseUrl,
      url: `/transactions/count`,
      params,
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

interface DetailsType {
  proxyUrl: string;
  addressId: string;
  timeout: number;
}

export async function getAddressDetails({ proxyUrl, addressId, timeout }: DetailsType) {
  try {
    const {
      data: {
        data: {
          account: { balance, code, nonce },
        },
        code: responseCode,
        error,
      },
    } = await axios.get(`${proxyUrl}/address/${addressId}`, { timeout });

    if (responseCode === 'successful') {
      return {
        addressId,
        balance,
        nonce,
        code,
        detailsFetched: true,
      };
    } else {
      throw new Error(error);
    }
  } catch (err) {
    return {
      addressId: '',
      balance: '0',
      nonce: 0,
      code: '',
      detailsFetched: addressIsBech32(addressId),
    };
  }
}

export async function getRewards({ proxyUrl, addressId, timeout }: DetailsType) {
  try {
    const {
      data: { claimableRewards, userStake },
    } = await axios.get(`${proxyUrl}/delegations/${addressId}`, { timeout });
    return { claimableRewards, userStake };
  } catch (err) {
    return { claimableRewards: 0, userStake: 0 };
  }
}
