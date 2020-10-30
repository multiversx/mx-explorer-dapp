import { faExchangeAlt } from '@fortawesome/pro-regular-svg-icons/faExchangeAlt';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useGlobalState } from 'context';
import { addressIsBech32, dateFormatted } from 'helpers';
import * as React from 'react';
import {
  ScAddressIcon,
  ShardSpan,
  TestnetLink,
  TimeAgo,
  adapter,
  PageState,
  Trim,
  Loader,
} from 'sharedComponents';
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
  const [transactionsFetched, setTransactionsFetched] = React.useState(true);

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
              const existingHashes = transactions.map((b) => b.txHash);
              const newTransactions = sortedTransactions.map((transaction: TransactionType) => ({
                ...transaction,
                isNew: !existingHashes.includes(transaction.txHash),
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
          <div className="card-body">
            <PageState
              icon={faExchangeAlt}
              title={'Unable to load transactions'}
              className="py-spacer d-flex h-100 align-items-center justify-content-center"
              data-testid="errorScreen"
            />
          </div>
        ) : (
          <>
            <div className="card-header border-bottom d-flex justify-content-between align-items-center">
              <h6 className="m-0">Latest Transactions</h6>
              <TestnetLink to="/transactions">View All Transactions</TestnetLink>
            </div>
            <div className="card-body card-scroll py-0">
              {transactions.length ? (
                <div className="animated-list" data-testid="transactionsList">
                  {transactions.map((transaction, i) => (
                    <div
                      key={transaction.txHash}
                      className={`row animated-row ${transaction.isNew && someNew ? 'new' : ''}`}
                    >
                      <div className="col-6 d-flex align-items-center">
                        <div className="list-item-icon mr-3">
                          <FontAwesomeIcon icon={faExchangeAlt} />
                        </div>
                        <div className="list-item-text min-w-0">
                          <div className="d-flex align-items-center">
                            <ScAddressIcon
                              initiator={transaction.sender}
                              secondInitiator={transaction.receiver}
                            />

                            <TestnetLink
                              to={`/transactions/${transaction.txHash}`}
                              data-testid={`transactionLink${i}`}
                              className="trim-wrapper"
                            >
                              <Trim text={transaction.txHash} />
                            </TestnetLink>
                          </div>
                          <span title={dateFormatted(transaction.timestamp)} className="text-muted">
                            <TimeAgo value={transaction.timestamp} />
                          </span>
                        </div>
                      </div>
                      <div className="col-6 list-item-text text-secondary">
                        <div className="d-flex align-items-center">
                          <span className="text-nowrap mr-2">From</span>

                          {addressIsBech32(transaction.sender) ? (
                            <TestnetLink
                              to={`/address/${transaction.sender}`}
                              className="trim-wrapper"
                            >
                              <Trim text={transaction.sender} />
                            </TestnetLink>
                          ) : (
                            <ShardSpan shardId={transaction.sender} />
                          )}
                        </div>
                        <div className="d-flex align-items-center">
                          <span className="text-nowrap mr-2">To</span>

                          <TestnetLink
                            to={`/address/${transaction.receiver}`}
                            data-testid={`transactionLinkTo${i}`}
                            className="trim-wrapper"
                          >
                            <Trim text={transaction.receiver} />
                          </TestnetLink>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Loader dataTestId="transactionsLoader" />
              )}
            </div>
          </>
        )}
      </div>
    );
  };
  return React.useMemo(Component, [transactions, transactionsFetched]);
};
export default LatestTransactions;
