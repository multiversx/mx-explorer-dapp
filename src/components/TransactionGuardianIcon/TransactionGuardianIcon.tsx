import React from 'react';
import { faShieldCheck } from 'icons/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Overlay } from 'components';
import { UITransactionType } from 'types';

export const TransactionGuardianIcon = ({
  transaction
}: {
  transaction: UITransactionType;
}) => {
  if (!transaction) {
    return null;
  }

  if (transaction?.guardianSignature) {
    const guardianText = transaction?.guardianAddress
      ? `Guardian: ${transaction?.guardianAddress}`
      : 'Guarded';

    return (
      <Overlay title={guardianText} className='guardian-icon'>
        <FontAwesomeIcon icon={faShieldCheck} className='text-primary me-1' />
      </Overlay>
    );
  }

  return null;
};
