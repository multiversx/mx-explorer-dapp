import { faExchangeAlt } from '@fortawesome/pro-regular-svg-icons/faExchangeAlt';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { addressIsBech32, urlBuilder, getReceiverAssets } from 'helpers';
import { getStatusIconAndColor } from 'components/TransactionStatus';
import * as React from 'react';
import {
  ShardSpan,
  NetworkLink,
  TimeAgo,
  useAdapter,
  Trim,
  Loader,
  LatestItem,
  AccountName,
  ScAddressIcon,
} from 'components';

import { FailedTransactions } from 'components/TransactionsTable/FailedTransactions';
import { NoTransactions } from 'components/TransactionsTable/NoTransactions';
import { TransactionValue } from 'components/TransactionsTable/TransactionValue';

import { UITransactionType } from 'types';

import { useSelector } from 'react-redux';
import { activeNetworkSelector, interfaceSelector } from 'redux/selectors';

export const LatestTransactions = () => {
  const ref = React.useRef(null);
  const {
    refresh: { timestamp },
  } = useSelector(interfaceSelector);
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);

  const [transactions, setTransactions] = React.useState<UITransactionType[]>([]);
  const [transactionsFetched, setTransactionsFetched] = React.useState<boolean | undefined>();
  const { getLatestTransactions } = useAdapter();
  const size = 5;

  const fetchTransactions = () => {
    getLatestTransactions({ size, withUsername: true }).then(({ data, success }) => {
      if (ref.current !== null) {
        if (success) {
          const existingHashes = transactions.map((b) => b.txHash);

          // keep previous transactions, reset isNew and update status
          let oldTransactions: UITransactionType[] = [...transactions.slice(0, size)];
          oldTransactions.forEach((oldTx) => {
            oldTx.isNew = false;

            if (oldTx.status === 'pending') {
              const newStatusTx = (data as UITransactionType[]).find(
                (newStatusTx) => newStatusTx.txHash === oldTx.txHash
              );
              oldTx.status = newStatusTx ? newStatusTx.status : oldTx.status;
            }
          });

          let newTransactions: UITransactionType[] = [];
          data.forEach((transaction: UITransactionType) => {
            const isNew = !existingHashes.includes(transaction.txHash);
            if (isNew) {
              newTransactions.push({
                ...transaction,
                isNew,
              });
            }
          });

          newTransactions = [...newTransactions, ...oldTransactions];

          const allNew =
            newTransactions.filter((a) => a.isNew === true).length === newTransactions.length;

          if (allNew) {
            newTransactions.forEach((transaction) => (transaction.isNew = false));
          }

          setTransactions(newTransactions);
        }
        setTransactionsFetched(success);
      }
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(fetchTransactions, [activeNetworkId, timestamp]);

  const Component = () => {
    return (
      <div className="card latest-transactions" ref={ref}>
        {transactionsFetched === undefined && <Loader dataTestId="transactionsLoader" />}
        {transactionsFetched === false && <FailedTransactions />}
        {transactionsFetched === true && transactions.length === 0 && <NoTransactions />}
        {transactionsFetched === true && transactions.length > 0 && (
          <>
            <div className="card-header">
              <div className="card-header-item d-flex justify-content-between align-items-center">
                <h6 className="m-0">Transactions</h6>
                <NetworkLink to="/transactions" className="btn btn-sm btn-primary-light">
                  View All Transactions
                </NetworkLink>
              </div>
            </div>
            <div className="card-body p-0" data-testid="transactionsList">
              <div className="latest-items-container">
                {transactions.map((transaction, i) => {
                  let receiver = transaction.receiver;
                  if (transaction?.action?.arguments?.receiver) {
                    receiver = transaction.action.arguments.receiver;
                  }

                  const receiverAssets = getReceiverAssets(transaction);

                  return (
                    <LatestItem
                      totalItems={transactions.length}
                      key={transaction.txHash}
                      isNew={transaction.isNew}
                      index={i + 1}
                    >
                      <div
                        className={`latest-item-card status-${
                          getStatusIconAndColor(transaction.status, transaction.pendingResults)
                            .color
                        }`}
                      >
                        <div className="d-flex flex-column overflow-hidden min-w-0">
                          <div className="d-flex flex-row mb-1 align-items-center justify-content-between">
                            <div className="d-flex align-items-center me-2">
                              <div className="latest-item-icon me-2">
                                <FontAwesomeIcon icon={faExchangeAlt} />
                              </div>
                              <div className="transaction-value">
                                <TransactionValue transaction={transaction} hideMultipleBadge />
                              </div>
                            </div>

                            <div className="text-secondary flex-shrink-0">
                              <TimeAgo value={transaction.timestamp} short /> ago
                            </div>
                          </div>

                          <div className="mb-1">
                            <div className="d-flex flex-row align-items-center text-secondary">
                              <span className="me-2">To:</span>
                              <ScAddressIcon initiator={receiver} />
                              <NetworkLink
                                to={urlBuilder.accountDetails(transaction.receiver)}
                                data-testid={`transactionLinkTo${i}`}
                                className="trim-wrapper"
                              >
                                <AccountName address={receiver} assets={receiverAssets} />
                              </NetworkLink>
                              <span className="px-2 text-muted ml-auto">•</span>
                              <NetworkLink
                                to={urlBuilder.receiverShard(transaction.receiverShard)}
                                className="flex-shrink-0"
                              >
                                <ShardSpan shard={transaction.receiverShard} />
                              </NetworkLink>
                            </div>
                          </div>

                          <div className="mb-1">
                            <div className="d-flex flex-row align-items-center text-secondary">
                              <span className="me-2">From:</span>
                              {addressIsBech32(transaction.sender) ? (
                                <>
                                  <ScAddressIcon initiator={transaction.sender} />
                                  <NetworkLink
                                    to={urlBuilder.accountDetails(transaction.sender)}
                                    className="trim-wrapper"
                                  >
                                    <AccountName
                                      address={transaction.sender}
                                      assets={transaction.senderAssets}
                                    />
                                  </NetworkLink>
                                  <span className="px-2 text-muted ml-auto">•</span>
                                  <NetworkLink
                                    to={urlBuilder.senderShard(transaction.senderShard)}
                                    className="flex-shrink-0"
                                  >
                                    <ShardSpan shard={transaction.senderShard} />
                                  </NetworkLink>
                                </>
                              ) : (
                                <ShardSpan shard={transaction.sender} />
                              )}
                            </div>
                          </div>

                          <div>
                            <div className="d-flex align-items-center">
                              <span className="text-secondary me-2">Hash:</span>

                              <NetworkLink
                                to={`/transactions/${transaction.txHash}`}
                                data-testid={`transactionLink${i}`}
                                className="trim-wrapper"
                              >
                                <Trim text={transaction.txHash} />
                              </NetworkLink>
                            </div>
                          </div>
                        </div>
                      </div>
                    </LatestItem>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };
  return React.useMemo(Component, [transactions, transactionsFetched]);
};
