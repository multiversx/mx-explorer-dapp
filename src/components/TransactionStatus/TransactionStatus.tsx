import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  getTransactionStatusIconAndColor,
  getTransactionStatusText
} from 'helpers';
import { UITransactionType } from 'types';

export const TransactionStatus = ({
  transaction
}: {
  transaction: UITransactionType;
}) => {
  const { icon, color } = getTransactionStatusIconAndColor({
    transaction
  });

  return (
    <span className='d-flex align-items-center text-capitalize me-2'>
      {icon && <FontAwesomeIcon icon={icon} className={`me-2 text-${color}`} />}
      {getTransactionStatusText({ transaction })}
    </span>
  );
};
