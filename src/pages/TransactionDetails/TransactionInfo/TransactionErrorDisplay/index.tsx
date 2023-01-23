import * as React from 'react';
import { faAngleDown } from '@fortawesome/pro-regular-svg-icons/faAngleDown';
import { faInfoCircle } from '@fortawesome/pro-regular-svg-icons/faInfoCircle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getTransactionMessages, capitalizeFirstLetter } from 'helpers';
import { TransactionType } from 'types';
import { NetworkLink, Overlay } from 'components';
import { decodeForDisplay, DecodeMethodType } from 'components/DataDecode';
import { transactionsRoutes } from 'routes';
import { TransactionErrorDescription } from './TransactionErrorDescription';

export const InternalErrorDisplay = ({ data }: { data: string }) => {
  if (data) {
    const dataBase64Buffer = Buffer.from(String(data), 'base64');
    const dataHexValue = dataBase64Buffer.toString('hex');
    const decodedDisplay = decodeForDisplay({
      input: dataHexValue,
      decodeMethod: DecodeMethodType.smart,
    });
    if (decodedDisplay.displayValue) {
      return <p className="text-left">{decodedDisplay.displayValue}</p>;
    }
  }

  return null;
};

export const TransactionErrorDisplay = ({ transaction }: { transaction: TransactionType }) => {
  const transactionMessages = getTransactionMessages(transaction);

  const internalVMErrorEvent =
    transaction?.logs?.events?.filter((log) => log.identifier === 'internalVMErrors')[0] ?? null;
  const logsLink = internalVMErrorEvent
    ? `${transactionsRoutes.transactions}/${transaction.txHash}/logs#${transaction?.logs?.id}/${internalVMErrorEvent.order}/text`
    : '';

  return (
    <>
      {transactionMessages.map((transactionMessage, messageIndex) => (
        <div key={`tx-message-${messageIndex}`} className="d-flex ml-1 align-items-center">
          <FontAwesomeIcon
            icon={faAngleDown}
            className="text-secondary"
            style={{ marginTop: '2px' }}
            transform={{ rotate: 45 }}
          />
          &nbsp;
          <div className="d-flex flex-wrap">
            <small className="text-danger ml-1">
              {' '}
              {capitalizeFirstLetter(transactionMessage.toString().trim())}
            </small>
            <div className="d-flex align-items-center justify-content-center">
              {/* VM ERRORS */}
              {logsLink && messageIndex === transactionMessages.length - 1 && (
                <>
                  <NetworkLink to={logsLink} className="small ml-1">
                    See logs
                  </NetworkLink>
                  {internalVMErrorEvent?.data && (
                    <div className="ml-1">
                      <Overlay
                        title={<InternalErrorDisplay data={internalVMErrorEvent.data} />}
                        className="d-flex"
                        tooltipClassName="vm-error-display"
                      >
                        <FontAwesomeIcon
                          icon={faInfoCircle}
                          className="small text-secondary ml-1"
                        />
                      </Overlay>
                    </div>
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
    </>
  );
};
