import React from 'react';
import { faCheckCircle, faBan, faHourglass, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface TransactionStatusType {
  status: string;
}

const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const TransactionStatus = ({ status }: TransactionStatusType) => {
  let Icon = () => <></>;
  switch (status.toLowerCase()) {
    case 'not executed':
      Icon = () => <FontAwesomeIcon icon={faBan} className="mr-2 text-danger" />;
      break;
    case 'fail':
    case 'failed':
      Icon = () => <FontAwesomeIcon icon={faTimes} className="mr-2 text-danger" />;
      break;
    case 'success':
      Icon = () => <FontAwesomeIcon icon={faCheckCircle} className="mr-2 text-success" />;
      break;
    case 'invalid':
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
