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

  let direction = '';
  switch (true) {
    case directionOut:
      direction = TransactionDirectionEnum.out;
      break;
    case directionIn:
      direction = TransactionDirectionEnum.in;
      break;
    case directionSelf:
      direction = TransactionDirectionEnum.self;
      break;
    case directionInternal:
      direction = TransactionDirectionEnum.internal;
      break;
  }

  return {
    direction
  };
};
