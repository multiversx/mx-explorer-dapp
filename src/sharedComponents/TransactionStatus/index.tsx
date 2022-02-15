import React from 'react';
import { faCheckCircle } from '@fortawesome/pro-solid-svg-icons/faCheckCircle';
import { faBan } from '@fortawesome/pro-solid-svg-icons/faBan';
import { faHourglass } from '@fortawesome/pro-solid-svg-icons/faHourglass';
import { faTimes } from '@fortawesome/pro-solid-svg-icons/faTimes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import txStatus from './txStatus';

interface TransactionStatusType {
  status: string;
}

export const getStatusIconAndColor = (status: TransactionStatusType['status']) => {
  const statusIs = (compareTo: string) => status.toLowerCase() === compareTo.toLowerCase();
  let Icon = () => <></>;
  let color = '';

  switch (true) {
    case statusIs(txStatus.notExecuted):
      color = 'text-danger';
      Icon = () => <FontAwesomeIcon icon={faBan} className={`mr-2 ${color}`} />;
      break;
    case statusIs(txStatus.fail):
    case statusIs(txStatus.failed):
    case statusIs(txStatus.rewardReverted):
      color = 'text-danger';
      Icon = () => <FontAwesomeIcon icon={faTimes} className={`mr-2 ${color}`} />;
      break;
    case statusIs(txStatus.success):
      color = 'text-success';
      Icon = () => <FontAwesomeIcon icon={faCheckCircle} className={`mr-2 ${color}`} />;
      break;
    case statusIs(txStatus.invalid):
      color = 'text-danger';
      Icon = () => <FontAwesomeIcon icon={faBan} className={`mr-2 ${color}`} />;
      break;
    default:
      color = 'text-warning';
      Icon = () => <FontAwesomeIcon icon={faHourglass} className={`mr-2 ${color}`} />;
  }

  return {
    Icon,
    color,
  };
};

const TransactionStatus = ({ status }: TransactionStatusType) => {
  const { Icon } = getStatusIconAndColor(status);

  return (
    <span className="d-flex align-items-center text-capitalize">
      <Icon />
      {status.replace('-', ' ')}
    </span>
  );
};

export default TransactionStatus;
