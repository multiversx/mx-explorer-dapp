import { faExchangeAlt } from '@fortawesome/pro-regular-svg-icons/faExchangeAlt';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useGlobalState } from 'context';
import { addressIsBech32, dateFormatted, trimHash } from 'helpers';
import * as React from 'react';
import { ScAddressIcon, ShardSpan, TestnetLink, TimeAgo, adapter } from 'sharedComponents';
import { TransactionType } from 'sharedComponents/TransactionsTable';

type LatestTransactionType = TransactionType & {
  isNew: boolean;
};

const LatestTransactions = () => {
  const ref = React.useRef(null);
  const {
    activeNetworkId,
    refresh: { timestamp },
  } = useGlobalState();
  const [transactions, setTransactions] = React.useState<LatestTransactionType[]>([]);
  const [transactionsFetched, setTransactionsFetched] = React.useState<boolean>(true);

  const { getLatestTransactions } = adapter();

  const fetchTransactions = () => {
    if (ref.current !== null) {
      getLatestTransactions().then(({ data, transactionsFetched }) => {
        if (ref.current !== null) {
          if (transactionsFetched) {
            const sortedTransactions = data;
            if (transactions.length === 0) {
              const newTransactions = sortedTransactions.map((transaction: TransactionType) => ({
                ...transaction,
                isNew: false,
              }));
              setTransactions(newTransactions);
            } else {
              const existingHashes = transactions.map((b) => b.hash);
              const newTransactions = sortedTransactions.map((transaction: TransactionType) => ({
                ...transaction,
                isNew: !existingHashes.includes(transaction.hash),
              }));
              setTransactions(newTransactions);
            }
            setTransactionsFetched(true);
          } else if (transactions.length === 0) {
            setTransactionsFetched(false);
          }
        }
      });
    }
  };

  React.useEffect(fetchTransactions, [activeNetworkId, timestamp]);

  const Component = () => {
    const someNew = transactions.some((transaction) => transaction.isNew);

    return (
      <div className="card card-small" ref={ref}>
        {!transactionsFetched ? (
          <div className="card-body card-details" data-testid="errorScreen">
            <div className="empty">
              <FontAwesomeIcon icon={faExchangeAlt} className="empty-icon" />
              <span className="h4 empty-heading">Unable to load transactions</span>
            </div>
          </div>
        ) : (
          <div className="card-body">
            <div className="d-flex align-items-center flex-row mb-3">
              <h4 className="card-title mb-0 mr-auto">Latest Transactions</h4>
              <TestnetLink to="/transactions">View All Transactions</TestnetLink>
            </div>
            <div className="card-scroll pt-0">
              {transactions.length ? (
                <div className="animated-list" data-testid="transactionsList">
                  {transactions.map((transaction, i) => (
                    <div
                      key={transaction.hash}
                      className={`row animated-row ${transaction.isNew && someNew ? 'new' : ''}`}
                    >
                      <div className="col-6">
                        <span className="icon-container-round">
                          <i>
                            <FontAwesomeIcon icon={faExchangeAlt} />
                          </i>
                        </span>
                        <div>
                          <ScAddressIcon
                            initiator={transaction.sender}
                            secondInitiator={transaction.receiver}
                          />
                          <TestnetLink
                            to={`/transactions/${transaction.hash}`}
                            data-testid={`transactionLink${i}`}
                          >
                            {trimHash(transaction.hash)}
                          </TestnetLink>
                        </div>
                        <span
                          className="text-secondary"
                          title={dateFormatted(transaction.timestamp)}
                        >
                          <TimeAgo value={transaction.timestamp} />
                        </span>
                      </div>
                      <div className="col-6">
                        From&nbsp;
                        {addressIsBech32(transaction.sender) ? (
                          <TestnetLink to={`/address/${transaction.sender}`}>
                            {trimHash(transaction.sender)}
                          </TestnetLink>
                        ) : (
                          <ShardSpan shardId={transaction.sender} />
                        )}
                        <br />
                        To&nbsp;
                        <TestnetLink
                          to={`/address/${transaction.receiver}`}
                          data-testid={`transactionLinkTo${i}`}
                        >
                          {trimHash(transaction.receiver)}
                        </TestnetLink>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className="row h-100 justify-content-center align-items-center"
                  data-testid="transactionsLoader"
                >
                  <div className="col-12 text-center">
                    <div className="lds-ellipsis mx-auto">
                      <div />
                      <div />
                      <div />
                      <div />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };
  return React.useMemo(Component, [transactions, transactionsFetched]);
};
export default LatestTransactions;
