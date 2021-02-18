import React from 'react';
import { faCheckCircle } from '@fortawesome/pro-regular-svg-icons/faCheckCircle';
import { faBan } from '@fortawesome/pro-regular-svg-icons/faBan';
import { faHourglass } from '@fortawesome/pro-regular-svg-icons/faHourglass';
import { faTimes } from '@fortawesome/pro-regular-svg-icons/faTimes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import txStatus from './txStatus';

interface TransactionStatusType {
  status: string;
  onlyText?: boolean;
}

const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const TransactionStatus = ({ status, onlyText }: TransactionStatusType) => {
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

  return onlyText ? (
    <span className={color}>{capitalizeFirstLetter(status)}</span>
  ) : (
    <>
      <Icon />
      {capitalizeFirstLetter(status)}
    </>
  );
};

export default TransactionStatus;
