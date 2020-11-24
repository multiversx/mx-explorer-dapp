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
