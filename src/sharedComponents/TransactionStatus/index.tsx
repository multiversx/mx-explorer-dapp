import React from 'react';
import { faCheckCircle } from '@fortawesome/pro-regular-svg-icons/faCheckCircle';
import { faBan } from '@fortawesome/pro-regular-svg-icons/faBan';
import { faHourglass } from '@fortawesome/pro-regular-svg-icons/faHourglass';
import { faTimes } from '@fortawesome/pro-regular-svg-icons/faTimes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import txStatus from './txStatus';

interface TransactionStatusType {
  status: string;
}

const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const TransactionStatus = ({ status }: TransactionStatusType) => {
  const statusIs = (compareTo: string) => status.toLowerCase() === compareTo.toLowerCase();

  let Icon = () => <></>;
  switch (true) {
    case statusIs(txStatus.notExecuted):
      Icon = () => <FontAwesomeIcon icon={faBan} className="mr-2 text-danger" />;
      break;
    case statusIs(txStatus.fail):
    case statusIs(txStatus.failed):
      Icon = () => <FontAwesomeIcon icon={faTimes} className="mr-2 text-danger" />;
      break;
    case statusIs(txStatus.success):
      Icon = () => <FontAwesomeIcon icon={faCheckCircle} className="mr-2 text-success" />;
      break;
    case statusIs(txStatus.invalid):
      Icon = () => <FontAwesomeIcon icon={faBan} className="mr-2 text-danger" />;
      break;
    default:
      Icon = () => <FontAwesomeIcon icon={faHourglass} className="mr-2 text-warning" />;
  }

  return (
    <>
      <Icon />
      {capitalizeFirstLetter(status)}
    </>
  );
};

export default TransactionStatus;
