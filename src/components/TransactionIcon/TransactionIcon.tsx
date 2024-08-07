import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import {
  TransactionGuardianIcon,
  TransactionSovereignBridgeIcon
} from 'components';
import {
  capitalizeFirstLetter,
  getTransactionMessages,
  getTransactionStatusIconAndColor,
  getTransactionStatusText
} from 'helpers';
import { useAdapter } from 'hooks';
import { faSpinnerThird, faTimes, faCheck } from 'icons/regular';
import {
  UITransactionType,
  TransactionType,
  TransactionApiStatusEnum,
  TransactionExtraStatusEnum
} from 'types';

interface TransactionIconType {
  transaction: UITransactionType;
  showSuccess?: boolean;
  showGuardian?: boolean;
  showSovereignBridge?: boolean;
  withBadge?: boolean;
}

export const TransactionIcon = ({
  transaction,
  showSuccess = false,
  showGuardian = true,
  showSovereignBridge = true,
  withBadge = false
}: TransactionIconType) => {
  const { getTransaction } = useAdapter();

  const [transactionMessages, setTransactionMessages] = useState<string[]>();
  const [dataReady, setDataReady] = useState<boolean | undefined>();
  const [transactionDetails, setTransactionDetails] = useState<
    TransactionType | undefined
  >();

  const { icon: statusIcon, color } = getTransactionStatusIconAndColor({
    transaction
  });

  const statusIs = (compareTo: string) =>
    transaction?.status && transaction.status.toLowerCase() === compareTo;

  const statusFailed =
    statusIs(TransactionApiStatusEnum.fail) ||
    statusIs(TransactionExtraStatusEnum.failed) ||
    statusIs(TransactionExtraStatusEnum.rewardReverted);
  const statusInvalid =
    statusIs(TransactionApiStatusEnum.invalid) ||
    statusIs(TransactionExtraStatusEnum.notExecuted);

  const fetchTransactionMessages = () => {
    if (transaction.txHash && (statusFailed || statusInvalid)) {
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

  const StatusIcon = () => {
    if (statusIs(TransactionApiStatusEnum.success) && !showSuccess) {
      return <></>;
    }

    return (
      <>
        {statusIcon && (
          <OverlayTrigger
            placement='top'
            delay={{ show: 0, hide: 400 }}
            onToggle={() => {
              fetchTransactionMessages();
            }}
            overlay={(props: any) => (
              <Tooltip {...props} show={props.show.toString()}>
                {getTransactionStatusText({ transaction })}
                {(statusFailed || statusInvalid) && (
                  <>
                    {dataReady ? (
                      <>
                        {transactionMessages &&
                          transactionMessages.length > 0 && (
                            <>
                              :{' '}
                              {transactionMessages.map(
                                (message, messageIndex) => (
                                  <span key={`tx-icon-message-${messageIndex}`}>
                                    {capitalizeFirstLetter(message)}
                                    {messageIndex > 0 ? ', ' : ''}
                                  </span>
                                )
                              )}
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
            {withBadge ? (
              <div className={`tx-badge border-${color}`}>
                <FontAwesomeIcon
                  icon={
                    statusIs(TransactionApiStatusEnum.success)
                      ? faCheck
                      : statusIcon
                  }
                  size={statusIcon === faTimes ? '1x' : 'sm'}
                  className={`me-1 tx-status text-${color}`}
                />
              </div>
            ) : (
              <FontAwesomeIcon
                icon={statusIcon}
                size={statusIcon === faTimes ? '1x' : 'sm'}
                className={`me-1 tx-status text-${color}`}
              />
            )}
          </OverlayTrigger>
        )}
      </>
    );
  };

  return (
    <>
      <StatusIcon />
      {showGuardian && <TransactionGuardianIcon transaction={transaction} />}
      {showSovereignBridge && (
        <TransactionSovereignBridgeIcon transaction={transaction} />
      )}
    </>
  );
};
