import * as React from 'react';
import { faAngleDown } from '@fortawesome/pro-regular-svg-icons/faAngleDown';
import { faInfoCircle } from '@fortawesome/pro-regular-svg-icons/faInfoCircle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getTransactionMessages } from 'helpers';
import { TransactionType } from 'helpers/types';
import { NetworkLink, Overlay } from 'sharedComponents';
import { decodeForDisplay, DecodeMethodType } from 'sharedComponents/DataDecode';
import { transactionsRoutes } from 'routes';

const InternalErrorDisplay = ({ data }: { data: string }) => {
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

const TransactionErrorDisplay = ({ transaction }: { transaction: TransactionType }) => {
  const transactionMessages = getTransactionMessages(transaction);

  const internalVMErrorEvent =
    transaction?.logs?.events?.filter((log) => log.identifier === 'internalVMErrors')[0] ?? null;
  const logsLink = internalVMErrorEvent
    ? `${transactionsRoutes.transactions}/${transaction.txHash}/logs#${transaction?.logs?.id}/${internalVMErrorEvent.order}/text`
    : '';

  return (
    <>
      {transactionMessages.map((msg, messageIndex) => (
        <div
          key={`tx-message-${messageIndex}`}
          className="d-flex ml-1 text-break-all align-items-center"
        >
          <FontAwesomeIcon
            icon={faAngleDown}
            className="text-secondary"
            style={{ marginTop: '2px' }}
            transform={{ rotate: 45 }}
          />
          &nbsp;
          <small className="text-danger ml-1"> {msg}</small>
          {/* TEMPORARY */}
          {msg === 'invalid liquidity for ESDT' && (
            <Overlay
              title="One of the selected tokens is temporarily immovable due to a pending ESDT protocol upgrade being deployed end of this week. Please check again later."
              className="d-flex"
              tooltipClassName="vm-error-display"
            >
              <FontAwesomeIcon icon={faInfoCircle} className="small text-secondary ml-1" />
            </Overlay>
          )}
          {/* VM ERRORS */}
          {logsLink && messageIndex === transactionMessages.length - 1 && (
            <div className="d-flex align-items-center justify-content-center">
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
                    <FontAwesomeIcon icon={faInfoCircle} className="small text-secondary ml-1" />
                  </Overlay>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default TransactionErrorDisplay;
