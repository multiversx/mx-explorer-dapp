import {
  UITransactionType,
  TransferTypeEnum,
  TransactionDirectionEnum
} from 'types';
import { getDisplayReceiver } from './getDisplayReceiver';

export const getTransactionDirection = ({
  transaction,
  address
}: {
  transaction: UITransactionType;
  address?: string;
}) => {
  if (!address) {
    return null;
  }

  const { receiver } = getDisplayReceiver(transaction);
  const directionOut = address === transaction.sender;
  const directionIn = address === receiver;
  const directionSelf = directionOut && directionIn;
  const isScResult = transaction?.type === TransferTypeEnum.SmartContractResult;
  const isInnerTransaction =
    transaction?.type === TransferTypeEnum.InnerTransaction ||
    transaction?.type === TransferTypeEnum.innerTx;

  switch (true) {
    case isInnerTransaction:
      return TransactionDirectionEnum.inner;
    case isScResult:
      return TransactionDirectionEnum.internal;
    case directionSelf:
      return TransactionDirectionEnum.self;
    case directionIn:
      return TransactionDirectionEnum.in;
    case directionOut:
    default:
      return TransactionDirectionEnum.out;
  }
};
