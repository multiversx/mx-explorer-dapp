import { TransactionOperationType, TransactionDirectionEnum } from 'types';

export const getOperationDirection = ({
  operation,
  address
}: {
  operation: TransactionOperationType;
  address: string;
}) => {
  const directionOut = address === operation.sender;
  const directionIn = address === operation.receiver;
  const directionSelf = directionOut && directionIn;
  const directionInternal = !directionSelf;

  switch (true) {
    case directionIn:
      return TransactionDirectionEnum.in;

    case directionSelf:
      return TransactionDirectionEnum.self;

    case directionInternal:
      return TransactionDirectionEnum.internal;

    case directionOut:
      return TransactionDirectionEnum.out;
    default:
      return null;
  }
};
