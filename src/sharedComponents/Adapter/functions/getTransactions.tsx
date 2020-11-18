import axios from 'axios';
import { AdapterFunctionType } from './index';

const getAccountParams = (address: string | undefined) =>
  address
    ? {
        sender: address,
        receiver: address,
      }
    : {};

export interface TransactionsType {
  size?: number;
  address?: string;
  senderShard?: number;
  receiverShard?: number;
}

export async function getTransactions({
  provider,
  baseUrl,
  timeout,
  address = '',
  size = 1,
  senderShard,
  receiverShard,
}: AdapterFunctionType & TransactionsType) {
  const params: AdapterFunctionType['params'] = {
    from: (size - 1) * 25,
    size: 25,
    ...getAccountParams(address),
    ...(senderShard !== undefined ? { senderShard } : {}),
    ...(receiverShard !== undefined ? { receiverShard } : {}),
    ...{
      fields: [
        'txHash',
        'receiver',
        'receiverShard',
        'sender',
        'senderShard',
        'status',
        'timestamp',
        'value',
      ].join(','),
    },
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
      success: data !== undefined,
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
  address = '',
  senderShard,
  receiverShard,
  timeout,
}: AdapterFunctionType & TransactionsType) {
  try {
    const params: AdapterFunctionType['params'] = {
      ...getAccountParams(address),
      ...(senderShard !== undefined ? { senderShard } : {}),
      ...(receiverShard !== undefined ? { receiverShard } : {}),
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

interface AccountType {
  proxyUrl: string;
  address: string;
  timeout: number;
}

export async function getAccountDetails({ proxyUrl, address, timeout }: AccountType) {
  try {
    const { data } = await axios.get(`${proxyUrl}/accounts/${address}`, { timeout });
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

export async function getRewards({ proxyUrl, address, timeout }: AccountType) {
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
    } = await axios.get(`${proxyUrl}/accounts/${address}/delegation`, { timeout });

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
