import React from 'react';
import { faCheckCircle } from '@fortawesome/pro-solid-svg-icons/faCheckCircle';
import { faBan } from '@fortawesome/pro-solid-svg-icons/faBan';
import { faHourglass } from '@fortawesome/pro-solid-svg-icons/faHourglass';
import { faTimes } from '@fortawesome/pro-solid-svg-icons/faTimes';
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
