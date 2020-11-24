import axios from 'axios';
import { AdapterFunctionType } from './index';

export const getAccountParams = (address?: string) =>
  address
    ? {
        sender: address,
        receiver: address,
      }
    : {};

export interface TransactionsParamsType {
  size?: number;
  address?: string;
  senderShard?: number;
  receiverShard?: number;
}

export function getTransactionsParams({
  address = '',
  size = 1,
  senderShard,
  receiverShard,
}: TransactionsParamsType) {
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

  return params;
}

interface AccountType {
  proxyUrl: string;
  address: string;
  timeout: number;
}

export async function getAccount({ proxyUrl, address, timeout }: AccountType) {
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
