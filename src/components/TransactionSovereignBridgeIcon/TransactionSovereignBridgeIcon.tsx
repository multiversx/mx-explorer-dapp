import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Overlay } from 'components';
import { faLinkHorizontal } from 'icons/duotone';
import { UITransactionType } from 'types';

const sovereignBridgeAddresses = [
  'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzllls8a5w6u'
];

export const getTransactionBridgeDetails = (transaction: UITransactionType) => {
  // From Main Chain to Sovereign
  if (transaction.function === 'deposit') {
    return { text: 'Send', icon: faLinkHorizontal };
  }
  if (transaction.function === 'registerBridgeOps') {
    return { text: 'Validate', icon: faLinkHorizontal };
  }
  if (transaction.function === 'executeBridgeOps') {
    return { text: 'Receive', icon: faLinkHorizontal };
  }

  // From Sovereign to Main Chain
  if (transaction.function === 'deposit') {
    return { text: 'Send', icon: faLinkHorizontal };
  }

  if (
    sovereignBridgeAddresses.includes(transaction.sender) &&
    transaction.function === 'MultiESDTNFTTransfer'
  ) {
    return { text: 'Receive', icon: faLinkHorizontal };
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
        title={`Sovereign Shard ${transactionBridgeDetails.text}`}
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
