import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { MAIN_SHARD_ID } from 'appConstants';
import { Overlay } from 'components';
import { useIsSovereign, useIsTestnet } from 'hooks';
import { faLinkHorizontal } from 'icons/duotone';
import { UITransactionType } from 'types';

const sovereignBridgeAddresses = [
  'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzllls8a5w6u'
];
const mainChainShardIds = [MAIN_SHARD_ID];

export const getTransactionBridgeDetails = (
  transaction: UITransactionType,
  isSovereign: boolean
) => {
  // From Sovereign to Main Chain
  if (isSovereign) {
    if (transaction.function === 'deposit') {
      return { text: 'Send', icon: faLinkHorizontal };
    }

    if (
      sovereignBridgeAddresses.includes(transaction.sender) &&
      mainChainShardIds.includes(transaction.senderShard) &&
      transaction.function === 'MultiESDTNFTTransfer'
    ) {
      return { text: 'Receive', icon: faLinkHorizontal };
    }
  }

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

  return {};
};

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
