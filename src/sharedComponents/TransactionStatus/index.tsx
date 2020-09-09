import React from 'react';
import { faCheckCircle, faBan, faHourglass, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface TransactionStatusType {
  status: string;
}

const TransactionStatus = ({ status }: TransactionStatusType) => {
  let Icon = () => <></>;
  switch (status) {
    case 'Not Executed':
      Icon = () => <FontAwesomeIcon icon={faBan} className="mr-2 text-danger" />;
      break;
    case 'Failed':
      Icon = () => <FontAwesomeIcon icon={faTimes} className="mr-2 text-danger" />;
      break;
    case 'Success':
      Icon = () => <FontAwesomeIcon icon={faCheckCircle} className="mr-2 text-success" />;
      break;
    case 'Invalid':
      Icon = () => <FontAwesomeIcon icon={faBan} className="mr-2 text-danger" />;
      break;
    default:
      Icon = () => <FontAwesomeIcon icon={faHourglass} className="mr-2 text-warning" />;
  }

  return (
    <>
      <Icon />
      {status}
    </>
  );
};

export default TransactionStatus;
