import React from 'react';
import { faShieldCheck } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Overlay } from 'sharedComponents';
import { UITransactionType } from 'helpers/types';

export const TransactionGuardianIcon = ({ transaction }: { transaction: UITransactionType }) => {
  if (!transaction) {
    return null;
  }

  if (transaction?.guardianSignature) {
    const guardianText = transaction?.guardianAddress
      ? `Guardian: ${transaction?.guardianAddress}`
      : 'Guarded';

    return (
      <Overlay title={guardianText} className="guardian-icon">
        <FontAwesomeIcon icon={faShieldCheck} className="text-primary mr-1" />
      </Overlay>
    );
  }

  return null;
};
