import React from 'react';
import { faBan } from '@fortawesome/pro-solid-svg-icons/faBan';
import { faCheckCircle } from '@fortawesome/pro-solid-svg-icons/faCheckCircle';
import { faHourglass } from '@fortawesome/pro-solid-svg-icons/faHourglass';
import { faTimes } from '@fortawesome/pro-solid-svg-icons/faTimes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { txStatus } from './txStatus';

interface TransactionStatusType {
  status: string;
  pendingResults?: boolean;
}

export const getStatusIconAndColor = (
  status: TransactionStatusType['status'],
  pendingResults: TransactionStatusType['pendingResults']
) => {
  const statusIs = (compareTo: string) =>
    status.toLowerCase() === compareTo.toLowerCase();
  let Icon = () => <></>;
  let color = '';

  switch (true) {
    case pendingResults:
      color = 'text-warning';
      Icon = () => (
        <FontAwesomeIcon icon={faHourglass} className={`me-2 ${color}`} />
      );
      break;
    case statusIs(txStatus.notExecuted):
      color = 'text-danger';
      Icon = () => <FontAwesomeIcon icon={faBan} className={`me-2 ${color}`} />;
      break;
    case statusIs(txStatus.fail):
    case statusIs(txStatus.failed):
    case statusIs(txStatus.rewardReverted):
      color = 'text-danger';
      Icon = () => (
        <FontAwesomeIcon icon={faTimes} className={`me-2 ${color}`} />
      );
      break;
    case statusIs(txStatus.success):
      color = 'text-success';
      Icon = () => (
        <FontAwesomeIcon icon={faCheckCircle} className={`me-2 ${color}`} />
      );
      break;
    case statusIs(txStatus.invalid):
      color = 'text-danger';
      Icon = () => <FontAwesomeIcon icon={faBan} className={`me-2 ${color}`} />;
      break;
    default:
      color = 'text-warning';
      Icon = () => (
        <FontAwesomeIcon icon={faHourglass} className={`me-2 ${color}`} />
      );
  }

  return {
    Icon,
    color
  };
};

const getStatusText = ({ status, pendingResults }: TransactionStatusType) => {
  switch (true) {
    case pendingResults:
      return 'Pending (Smart Contract Execution)';
    case status === txStatus.rewardReverted:
      return txStatus.fail;
    default:
      return status;
  }
};

export const TransactionStatus = ({
  status,
  pendingResults
}: TransactionStatusType) => {
  const { Icon } = getStatusIconAndColor(status, pendingResults);

  return (
    <span className='d-flex align-items-center text-capitalize me-2'>
      <Icon />
      {getStatusText({ status, pendingResults })}
    </span>
  );
};
