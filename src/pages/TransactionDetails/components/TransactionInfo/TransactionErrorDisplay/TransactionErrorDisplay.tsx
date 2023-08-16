import React from 'react';
import { faAngleDown } from '@fortawesome/pro-regular-svg-icons/faAngleDown';
import { faInfoCircle } from '@fortawesome/pro-regular-svg-icons/faInfoCircle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { NetworkLink, Overlay } from 'components';
import { decodeForDisplay, DecodeMethodType } from 'components/DataDecode';
import { getTransactionMessages, capitalizeFirstLetter } from 'helpers';
import { transactionsRoutes } from 'routes';
import {
  TransactionType,
  TransactionApiStatusEnum,
  TransactionExtraStatusEnum
} from 'types';
import { TransactionErrorDescription } from './TransactionErrorDescription';

export const InternalErrorDisplay = ({ data }: { data: string }) => {
  if (data) {
    const dataBase64Buffer = Buffer.from(String(data), 'base64');
    const dataHexValue = dataBase64Buffer.toString('hex');
    const decodedDisplay = decodeForDisplay({
      input: dataHexValue,
      decodeMethod: DecodeMethodType.smart
    });
    if (decodedDisplay.displayValue) {
      return <p className='text-start'>{decodedDisplay.displayValue}</p>;
    }
  }

  return null;
};

export const TransactionErrorDisplay = ({
  transaction
}: {
  transaction: TransactionType;
}) => {
  const transactionMessages = getTransactionMessages(transaction);

  const internalVMErrorEvent =
    transaction?.logs?.events?.filter(
      (log) => log.identifier === 'internalVMErrors'
    )[0] ?? null;

  const logsLink = internalVMErrorEvent
    ? `${transactionsRoutes.transactions}/${transaction.txHash}/logs#${transaction?.logs?.id}/${internalVMErrorEvent.order}/text`
    : '';

  const messageColor =
    transaction.status === TransactionApiStatusEnum.success ||
    transaction.status === TransactionApiStatusEnum.pending
      ? ''
      : 'text-danger';

  return (
    <>
      {transactionMessages.map((transactionMessage, messageIndex) => (
        <div
          key={`tx-message-${messageIndex}`}
          className='d-flex align-items-start ms-1'
        >
          <FontAwesomeIcon
            icon={faAngleDown}
            className='text-neutral-400 me-2'
            style={{ marginTop: '2px' }}
            transform={{ rotate: 45 }}
          />
          <div className='d-flex flex-wrap'>
            <small className={`${messageColor} transaction-error-message me-1`}>
              {capitalizeFirstLetter(transactionMessage.toString().trim())}
            </small>
            <div className='d-flex align-items-center justify-content-center gap-1'>
              {/* VM ERRORS */}
              {logsLink && messageIndex === transactionMessages.length - 1 && (
                <>
                  <NetworkLink to={logsLink} className='small'>
                    See logs
                  </NetworkLink>
                  {internalVMErrorEvent?.data && (
                    <Overlay
                      title={
                        <InternalErrorDisplay
                          data={internalVMErrorEvent.data}
                        />
                      }
                      className='d-flex'
                      tooltipClassName='vm-error-display'
                    >
                      <FontAwesomeIcon
                        icon={faInfoCircle}
                        className='small text-neutral-400 cursor-context'
                      />
                    </Overlay>
                  )}
                </>
              )}
              {transactionMessage && (
                <TransactionErrorDescription
                  message={transactionMessage}
                  transaction={transaction}
                />
              )}
            </div>
          </div>
        </div>
      ))}
      {transaction.status === TransactionExtraStatusEnum.rewardReverted && (
        <div className='d-flex align-items-start ms-1'>
          <FontAwesomeIcon
            icon={faAngleDown}
            className='text-neutral-400 me-2'
            style={{ marginTop: '2px' }}
            transform={{ rotate: 45 }}
          />
          <small className='transaction-error-message text-danger'>
            Block Reverted
          </small>
        </div>
      )}
    </>
  );
};
