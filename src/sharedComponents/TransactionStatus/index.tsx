import React from 'react';
import { faCheckCircle, faBan, faHourglass, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import txStatus from '../../components/TransactionDetails/txStatus';

interface TransactionStatusType {
  status: string;
}

const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const TransactionStatus = ({ status }: TransactionStatusType) => {
  const statusIs = (compateTo: string) => status.toLowerCase() === compateTo.toLowerCase();

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
