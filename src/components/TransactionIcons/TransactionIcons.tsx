import {
  TransactionGuardianIcon,
  TransactionSovereignBridgeIcon,
  TransactionStatusIcon,
  TransactionRelayedIcon
} from 'components';
import { UITransactionType } from 'types';

interface TransactionIconsUIType {
  transaction: UITransactionType;
  showSuccess?: boolean;
  showGuardian?: boolean;
  showRelayed?: boolean;
  showStatus?: boolean;
  showSovereignBridge?: boolean;
  withBadge?: boolean;
}

export const TransactionIcons = ({
  transaction,
  showSuccess = false,
  showGuardian = true,
  showRelayed = true,
  showStatus = true,
  showSovereignBridge = true,
  withBadge = false
}: TransactionIconsUIType) => {
  return (
    <>
      {showStatus && (
        <TransactionStatusIcon
          transaction={transaction}
          showSuccess={showSuccess}
          withBadge={withBadge}
        />
      )}
      {showGuardian && <TransactionGuardianIcon transaction={transaction} />}
      {showSovereignBridge && (
        <TransactionSovereignBridgeIcon transaction={transaction} />
      )}
      {showRelayed && <TransactionRelayedIcon transaction={transaction} />}
    </>
  );
};
