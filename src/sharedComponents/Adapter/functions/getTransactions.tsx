import axios from 'axios';
import { AdapterFunctionType } from './index';

const getAddressParams = (addressId: string | undefined) =>
  addressId
    ? {
        sender: addressId,
        receiver: addressId,
      }
    : {};

export interface TransactionsType {
  size?: number;
  addressId?: string;
  senderShard?: number;
  receiverShard?: number;
}

export async function getTransactions({
  provider,
  baseUrl,
  timeout,
  addressId = '',
  size = 1,
  senderShard,
  receiverShard,
}: AdapterFunctionType & TransactionsType) {
  const params: AdapterFunctionType['params'] = {
    from: (size - 1) * 50,
    size: 50,
    ...getAddressParams(addressId),
    ...(senderShard !== undefined ? { senderShard } : {}),
    ...(receiverShard !== undefined ? { receiverShard } : {}),
  };

  try {
    const { data } = await provider({
      baseUrl,
      url: `/transactions`,
      params,
      timeout,
    });

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
  senderShard,
  receiverShard,
  timeout,
}: AdapterFunctionType & TransactionsType) {
  try {
    const params: AdapterFunctionType['params'] = {
      ...getAddressParams(addressId),
      ...(senderShard !== undefined ? { senderShard } : {}),
      ...(receiverShard !== undefined ? { receiverShard } : {}),
    };

    const { data } = await provider({
      baseUrl,
      url: `/transactions-alt/count`,
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
    const { data } = await axios.get(`${proxyUrl}/addresses/${addressId}`, { timeout });
    return {
      data,
      success: true,
    };
  } catch (err) {
    return {
      success: false,
    };
  }
}

export async function getRewards({ proxyUrl, addressId, timeout }: DetailsType) {
  try {
    const {
      data: {
        claimableRewards,
        userActiveStake,
        userDeferredPaymentStake,
        userUnstakedStake,
        userWaitingStake,
        userWithdrawOnlyStake,
      },
    } = await axios.get(`${proxyUrl}/addresses/${addressId}/delegation`, { timeout });

    return {
      claimableRewards,
      userActiveStake,
      userDeferredPaymentStake,
      userUnstakedStake,
      userWaitingStake,
      userWithdrawOnlyStake,
      success: true,
    };
  } catch (err) {
    return {
      success: false,
    };
  }
}
