import React from 'react';
import { TransactionType } from './TransactionRow';
import txStatus from '../TransactionStatus/txStatus';
import { faBan } from '@fortawesome/pro-regular-svg-icons/faBan';
import { faTimes } from '@fortawesome/pro-regular-svg-icons/faTimes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

interface TransactionIconType {
  transaction: TransactionType;
}

const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const TransactionIcon = ({ transaction }: TransactionIconType) => {
  const statusIs = (compareTo: string) =>
    transaction.status.toLowerCase() === compareTo.toLowerCase();

  const failed = statusIs(txStatus.failed) || statusIs(txStatus.fail);
  const invalid = statusIs(txStatus.notExecuted) || statusIs(txStatus.invalid);
  const icon = failed ? faTimes : faBan;

  return !failed && !invalid ? null : (
    <>
      <OverlayTrigger
        placement="top"
        delay={{ show: 0, hide: 400 }}
        overlay={(props: any) => (
          <Tooltip {...props} show={props.show.toString()}>
            {capitalizeFirstLetter(transaction.status)}
          </Tooltip>
        )}
      >
        <FontAwesomeIcon
          icon={icon}
          size={icon === faBan ? 'sm' : '1x'}
          className="mr-1 text-secondary"
        />
      </OverlayTrigger>
    </>
  );
};

export default TransactionIcon;
