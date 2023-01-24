import React from 'react';
import { faBan } from '@fortawesome/pro-regular-svg-icons/faBan';
import { faHourglass } from '@fortawesome/pro-regular-svg-icons/faHourglass';
import { faSpinnerThird } from '@fortawesome/pro-regular-svg-icons/faSpinnerThird';
import { faTimes } from '@fortawesome/pro-regular-svg-icons/faTimes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useAdapter } from 'components';
import { capitalizeFirstLetter, getTransactionMessages } from 'helpers';
import { UITransactionType, TransactionType } from 'types';
import { txStatus } from '../TransactionStatus/txStatus';
interface TransactionIconType {
  transaction: UITransactionType;
}

export const TransactionIcon = ({ transaction }: TransactionIconType) => {
  const { getTransaction } = useAdapter();

  const [transactionMessages, setTransactionMessages] =
    React.useState<string[]>();
  const [dataReady, setDataReady] = React.useState<boolean | undefined>();
  const [transactionDetails, setTransactionDetails] = React.useState<
    TransactionType | undefined
  >();

  const statusIs = (compareTo: string) =>
    transaction.status.toLowerCase() === compareTo.toLowerCase();

  const failed = statusIs(txStatus.failed) || statusIs(txStatus.fail);
  const invalid = statusIs(txStatus.notExecuted) || statusIs(txStatus.invalid);
  const pending = statusIs(txStatus.pending);

  const fetchTransactionMessages = () => {
    if (transaction.txHash && (failed || invalid)) {
      if (transaction.txHash !== transactionDetails?.txHash) {
        getTransaction(transaction.txHash).then(({ data, success }) => {
          setDataReady(success);
          setTransactionDetails(data);

          const transactionMessages = getTransactionMessages(data);
          setTransactionMessages(transactionMessages);
        });
      }
    }
  };

  let icon;
  if (failed) icon = faTimes;
  if (invalid) icon = faBan;
  if (pending) icon = faHourglass;

  return icon === undefined ? null : (
    <>
      <OverlayTrigger
        placement='top'
        delay={{ show: 0, hide: 400 }}
        onToggle={() => {
          fetchTransactionMessages();
        }}
        overlay={(props: any) => (
          <Tooltip {...props} show={props.show.toString()}>
            {capitalizeFirstLetter(transaction.status)}
            {(failed || invalid) && (
              <>
                {dataReady ? (
                  <>
                    {transactionMessages && transactionMessages.length > 0 && (
                      <>
                        :{' '}
                        {transactionMessages.map((message, messageIndex) => (
                          <span key={`tx-icon-message-${messageIndex}`}>
                            {capitalizeFirstLetter(message)}
                            {messageIndex > 0 ? ', ' : ''}
                          </span>
                        ))}
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon
                      icon={faSpinnerThird}
                      size={'sm'}
                      className='ms-2 fa-spin fast-spin'
                    />
                  </>
                )}
              </>
            )}
          </Tooltip>
        )}
      >
        <FontAwesomeIcon
          icon={icon}
          size={icon === faTimes ? '1x' : 'sm'}
          className='me-1 text-secondary'
        />
      </OverlayTrigger>
    </>
  );
};
