import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Overlay } from 'components';
import { getTransactionBridgeDetails } from 'helpers';
import { useIsSovereign, useIsTestnet } from 'hooks';
import { UITransactionType } from 'types';

export const TransactionSovereignBridgeIcon = ({
  transaction
}: {
  transaction: UITransactionType;
}) => {
  const isSovereign = useIsSovereign();
  const isTestnet = useIsTestnet();

  if (!transaction?.function || !(isSovereign || isTestnet)) {
    return null;
  }

  const transactionBridgeDetails = getTransactionBridgeDetails(
    transaction,
    isSovereign
  );

  if (transactionBridgeDetails?.icon && transactionBridgeDetails?.text) {
    return (
      <Overlay
        title={`Cross-Chain ${transactionBridgeDetails.text} Transaction`}
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
