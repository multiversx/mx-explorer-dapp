import { capitalizeFirstLetter } from 'helpers';
import {
  TransactionApiStatusEnum,
  TransactionExtraStatusEnum,
  UITransactionType
} from 'types';

export const getTransactionStatusText = ({
  transaction
}: {
  transaction: UITransactionType;
}) => {
  if (!transaction) return '';

  switch (true) {
    case transaction.pendingResults:
      return 'Pending (Smart Contract Execution)';
    case transaction.status === TransactionExtraStatusEnum.rewardReverted:
      return capitalizeFirstLetter(TransactionApiStatusEnum.fail);
    default:
      return capitalizeFirstLetter(transaction.status);
  }
};
