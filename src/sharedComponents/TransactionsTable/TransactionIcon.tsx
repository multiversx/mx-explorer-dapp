import React from 'react';
import txStatus from '../TransactionStatus/txStatus';
import { faBan } from '@fortawesome/pro-regular-svg-icons/faBan';
import { faTimes } from '@fortawesome/pro-regular-svg-icons/faTimes';
import { faHourglass } from '@fortawesome/pro-regular-svg-icons/faHourglass';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { UITransactionType, TransactionType } from 'helpers/types';

interface TransactionIconType {
  transaction: UITransactionType;
}

const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const getScResultsMessages = (transaction: TransactionType) => {
  const messages: string[] = [];

  if (transaction.results) {
    transaction.results.forEach((result) => {
      if (result.returnMessage) {
        messages.push(result.returnMessage);
      }
    });
  }

  return messages;
};

const TransactionIcon = ({ transaction }: TransactionIconType) => {
  const statusIs = (compareTo: string) =>
    transaction.status.toLowerCase() === compareTo.toLowerCase();

  const scResultsMessages = getScResultsMessages(transaction);

  const failed = statusIs(txStatus.failed) || statusIs(txStatus.fail);
  const invalid = statusIs(txStatus.notExecuted) || statusIs(txStatus.invalid);
  const pending = statusIs(txStatus.pending);

  let icon;
  if (failed) icon = faTimes;
  if (invalid) icon = faBan;
  if (pending) icon = faHourglass;

  return icon === undefined ? null : (
    <>
      <OverlayTrigger
        placement="top"
        delay={{ show: 0, hide: 400 }}
        overlay={(props: any) => (
          <Tooltip {...props} show={props.show.toString()}>
            {capitalizeFirstLetter(transaction.status)}
            {failed && scResultsMessages.length > 0 && (
              <>
                :{' '}
                {scResultsMessages.map((message) => (
                  <span className="text-capitalize">{message}</span>
                ))}
              </>
            )}
          </Tooltip>
        )}
      >
        <FontAwesomeIcon
          icon={icon}
          size={icon === faTimes ? '1x' : 'sm'}
          className="mr-1 text-secondary"
        />
      </OverlayTrigger>
    </>
  );
};

export default TransactionIcon;
