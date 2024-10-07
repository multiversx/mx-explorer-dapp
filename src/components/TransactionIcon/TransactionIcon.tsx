import {
  TransactionGuardianIcon,
  TransactionSovereignBridgeIcon
} from 'components';
import { UITransactionType } from 'types';

import { TransactionStatusIcon } from './TransactionStatusIcon';

interface TransactionIconUIType {
  transaction: UITransactionType;
  showSuccess?: boolean;
  showGuardian?: boolean;
  showSovereignBridge?: boolean;
  withBadge?: boolean;
}

export const TransactionIcon = ({
  transaction,
  showSuccess = false,
  showGuardian = true,
  showSovereignBridge = true,
  withBadge = false
}: TransactionIconUIType) => {
  return (
    <>
      <TransactionStatusIcon
        transaction={transaction}
        showSuccess={showSuccess}
        withBadge={withBadge}
      />
      {showGuardian && <TransactionGuardianIcon transaction={transaction} />}
      {showSovereignBridge && (
        <TransactionSovereignBridgeIcon transaction={transaction} />
      )}
    </>
  );
};
