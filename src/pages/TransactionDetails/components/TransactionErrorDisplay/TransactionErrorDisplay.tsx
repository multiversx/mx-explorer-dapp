import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { InfoTooltip, NetworkLink } from 'components';
import {
  getTransactionMessages,
  capitalizeFirstLetter,
  urlBuilder
} from 'helpers';
import { faAngleDown } from 'icons/regular';
import { DecodeMethodEnum, getAllDecodedFormats } from 'lib';
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
    const decodedDisplay = getAllDecodedFormats({
      data: dataHexValue,
      highlight: ''
    });
    const decodedValue = decodedDisplay[DecodeMethodEnum.smart];
    if (decodedValue?.displayValue) {
      return <p className='text-start'>{decodedValue.displayValue}</p>;
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
    ? urlBuilder.transactionDetailsLogs(transaction.txHash, {
        id: transaction?.logs?.id ?? '',
        order: internalVMErrorEvent.order,
        dataDecode: DecodeMethodEnum.text,
        topicsDecode: DecodeMethodEnum.raw,
        additionalDataDecode: DecodeMethodEnum.raw
      })
    : '';

  const messageColor =
    transaction.status === TransactionApiStatusEnum.success ||
    transaction.status === TransactionApiStatusEnum.pending
      ? ''
      : 'text-danger';

  if (transactionMessages.length === 0 && internalVMErrorEvent) {
    transactionMessages.push('Internal VM Error');
  }

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
          <div className='d-flex flex-wrap align-items-center'>
            <small
              className={`${messageColor} transaction-error-message text-break me-1`}
            >
              {capitalizeFirstLetter(transactionMessage.toString().trim())}
            </small>
            <div className='d-flex align-items-center justify-content-center'>
              {/* VM ERRORS */}
              {logsLink && messageIndex === transactionMessages.length - 1 && (
                <>
                  <NetworkLink to={logsLink} className='small'>
                    See logs
                  </NetworkLink>
                  {internalVMErrorEvent?.data && (
                    <InfoTooltip
                      title={
                        <InternalErrorDisplay
                          data={internalVMErrorEvent.data}
                        />
                      }
                      tooltipClassName='vm-error-display'
                      iconClassName='small'
                      persistent
                    />
                  )}
                </>
              )}
              {transactionMessage && (
                <TransactionErrorDescription message={transactionMessage} />
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
          <small className='transaction-error-message text-break text-danger'>
            Block Reverted
          </small>
        </div>
      )}
    </>
  );
};
