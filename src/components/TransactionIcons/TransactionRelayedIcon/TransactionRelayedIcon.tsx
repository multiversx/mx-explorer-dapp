import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Overlay } from 'components';
import { faHandshake } from 'icons/regular';
import { UITransactionType } from 'types';

export const TransactionRelayedIcon = ({
  transaction
}: {
  transaction: UITransactionType;
}) => {
  if (
    transaction?.isRelayed ||
    transaction?.relayerSignature ||
    transaction?.relayer
  ) {
    const relayedText = transaction?.relayedVersion
      ? `Relayed Version: ${transaction.relayedVersion}`
      : 'Relayed';

    return (
      <Overlay title={relayedText} className='relayed-icon'>
        <FontAwesomeIcon icon={faHandshake} className='text-primary me-1' />
      </Overlay>
    );
  }

  return null;
};
