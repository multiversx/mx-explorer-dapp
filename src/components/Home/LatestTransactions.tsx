import { faExchangeAlt } from '@fortawesome/pro-regular-svg-icons/faExchangeAlt';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useGlobalState } from 'context';
import { addressIsBech32, urlBuilder } from 'helpers';
import { getStatusIconAndColor } from 'sharedComponents/TransactionStatus';
import * as React from 'react';
import {
  ShardSpan,
  NetworkLink,
  TimeAgo,
  adapter,
  Trim,
  Loader,
  Denominate,
  LatestItem,
} from 'sharedComponents';
import { TransactionType } from 'sharedComponents/TransactionsTable';
import FailedTransactions from 'sharedComponents/TransactionsTable/FailedTransactions';
import NoTransactions from 'sharedComponents/TransactionsTable/NoTransactions';

const LatestTransactions = () => {
  const ref = React.useRef(null);
  const {
    activeNetworkId,
    refresh: { timestamp },
  } = useGlobalState();
  const [transactions, setTransactions] = React.useState<TransactionType[]>([]);
  const [transactionsFetched, setTransactionsFetched] = React.useState<boolean | undefined>();
  const { getLatestTransactions } = adapter();
  const size = 6;

  const fetchTransactions = () => {
    getLatestTransactions({ size }).then(({ data, success }) => {
      if (ref.current !== null) {
        if (success) {
          const existingHashes = transactions.map((b) => b.txHash);

          // keep first 4 items and reset isNew
          // update pending transactions
          let newTransactions: TransactionType[] = [...transactions.slice(0, 4)];
          newTransactions.forEach((transaction) => {
            transaction.isNew = false;

            if (transaction.status === 'pending') {
              const newStatusTx = (data as TransactionType[]).find(
                (newStatusTx) => newStatusTx.txHash === transaction.txHash
              );
              transaction.status = newStatusTx ? newStatusTx.status : transaction.status;
            }
          });

          data.forEach((transaction: TransactionType) => {
            const isNew = !existingHashes.includes(transaction.txHash);
            if (isNew) {
              newTransactions.unshift({
                ...transaction,
                isNew,
              });
            }
          });

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

  React.useEffect(fetchTransactions, [activeNetworkId, timestamp]);

  const Component = () => {
    return (
      <div className="card" ref={ref}>
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
                {transactions.map((transaction, i) => (
                  <LatestItem
                    maxNewItems={size}
                    key={transaction.txHash}
                    isNew={transaction.isNew}
                    index={i + 1}
                  >
                    <div
                      className={`latest-item-card status-${
                        getStatusIconAndColor(transaction.status).color
                      }`}
                    >
                      <div className="d-flex flex-column overflow-hidden min-w-0">
                        <div className="d-flex flex-row mb-1 align-items-center justify-content-between">
                          <div className="d-flex align-items-center mr-2">
                            <div className="latest-item-icon mr-2">
                              <FontAwesomeIcon icon={faExchangeAlt} />
                            </div>
                            <div className="d-flex">
                              <Denominate value={transaction.value} decimals={4} />
                            </div>
                          </div>

                          <div className="text-secondary flex-shrink-0">
                            <TimeAgo value={transaction.timestamp} short tooltip />
                          </div>
                        </div>

                        <div className="mb-1">
                          <div className="d-flex align-items-center">
                            <span className="text-secondary mr-2">Hash:</span>

                            <NetworkLink
                              to={`/transactions/${transaction.txHash}`}
                              data-testid={`transactionLink${i}`}
                              className="trim-wrapper"
                            >
                              <Trim text={transaction.txHash} />
                            </NetworkLink>
                          </div>
                        </div>

                        <div className="mb-1">
                          <div className="d-flex flex-row align-items-center text-secondary">
                            <span className="mr-2">From:</span>
                            {addressIsBech32(transaction.sender) ? (
                              <>
                                <NetworkLink
                                  to={urlBuilder.accountDetails(transaction.sender)}
                                  className="trim-wrapper"
                                >
                                  <Trim text={transaction.sender} />
                                </NetworkLink>
                                <span className="mx-2 text-muted">•</span>
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
                          <div className="d-flex flex-row align-items-center text-secondary">
                            <span className="mr-2">To:</span>
                            <NetworkLink
                              to={urlBuilder.accountDetails(transaction.receiver)}
                              data-testid={`transactionLinkTo${i}`}
                              className="trim-wrapper"
                            >
                              <Trim text={transaction.receiver} />
                            </NetworkLink>
                            <span className="mx-2 text-muted">•</span>
                            <NetworkLink
                              to={urlBuilder.receiverShard(transaction.receiverShard)}
                              className="flex-shrink-0"
                            >
                              <ShardSpan shard={transaction.receiverShard} />
                            </NetworkLink>
                          </div>
                        </div>
                      </div>
                    </div>
                  </LatestItem>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };
  return React.useMemo(Component, [transactions, transactionsFetched]);
};
export default LatestTransactions;
