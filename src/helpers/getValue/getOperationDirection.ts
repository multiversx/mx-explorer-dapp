import {
  TransactionOperationType,
  TransactionOperationDirectionEnum
} from 'types';

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
      direction = TransactionOperationDirectionEnum.out;
      break;
    case directionIn:
      direction = TransactionOperationDirectionEnum.in;
      break;
    case directionSelf:
      direction = TransactionOperationDirectionEnum.self;
      break;
    case directionInternal:
      direction = TransactionOperationDirectionEnum.internal;
      break;
  }

  return {
    direction
  };
};
