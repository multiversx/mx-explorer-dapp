import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Overlay } from 'components';
import { faPersonFromPortal, faPersonToPortal } from 'icons/solid';
import {
  UITransactionType,
  TransactionActionCategoryEnum,
  TransactionActionEnum
} from 'types';

const sovereignBridgeAddresses = [
  'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzllls8a5w6u'
];

export const getTransactionBridgeDetails = (transaction: UITransactionType) => {
  // From Main Chain to Sovereign
  if (transaction.function === 'deposit') {
    return { text: 'Send', icon: faPersonToPortal };
  }
  if (transaction.function === 'registerBridgeOps') {
    return { text: 'Validate', icon: faPersonToPortal };
  }
  if (transaction.function === 'executeBridgeOps') {
    return { text: 'Receive', icon: faPersonToPortal };
  }

  // From Sovereign to Main Chain
  if (transaction.function === 'deposit') {
    return { text: 'Send', icon: faPersonFromPortal };
  }

  if (
    sovereignBridgeAddresses.includes(transaction.sender) &&
    transaction.action?.category === TransactionActionCategoryEnum.esdtNft &&
    transaction.action?.name === TransactionActionEnum.transfer
  ) {
    return { text: 'Receive', icon: faPersonFromPortal };
  }

  return {};
};

export const TransactionSovereignBridgeIcon = ({
  transaction
}: {
  transaction: UITransactionType;
}) => {
  if (!transaction?.function) {
    return null;
  }

  const transactionBridgeDetails = getTransactionBridgeDetails(transaction);

  if (transactionBridgeDetails?.icon && transactionBridgeDetails?.text) {
    return (
      <Overlay
        title={`Sovereign Bridge ${transactionBridgeDetails.text}`}
        className='sovereign-bridge-icon'
      >
        <FontAwesomeIcon
          icon={transactionBridgeDetails.icon}
          className='text-primary me-1'
        />
      </Overlay>
    );
  }

  return null;
};
