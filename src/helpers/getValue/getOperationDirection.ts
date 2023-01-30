import { OperationType, OperationDirectionEnum } from 'types';

export const getOperationDirection = ({
  operation,
  address
}: {
  operation: OperationType;
  address: string;
}) => {
  const directionOut = address === operation.sender;
  const directionIn = address === operation.receiver;
  const directionSelf = directionOut && directionIn;
  const directionInternal = !directionSelf;

  let direction = '';
  switch (true) {
    case directionOut:
      direction = OperationDirectionEnum.out;
      break;
    case directionIn:
      direction = OperationDirectionEnum.in;
      break;
    case directionSelf:
      direction = OperationDirectionEnum.self;
      break;
    case directionInternal:
      direction = OperationDirectionEnum.internal;
      break;
  }

  return {
    direction
  };
};
