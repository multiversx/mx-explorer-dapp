import { faExchangeAlt } from '@fortawesome/pro-regular-svg-icons/faExchangeAlt';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useGlobalState } from 'context';
import { addressIsBech32, dateFormatted, urlBuilder } from 'helpers';
import * as React from 'react';
import {
  ScAddressIcon,
  ShardSpan,
  NetworkLink,
  TimeAgo,
  adapter,
  Trim,
  Loader,
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

  const fetchTransactions = () => {
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
        }
        setTransactionsFetched(transactionsFetched);
      }
    });
  };

  React.useEffect(fetchTransactions, [activeNetworkId, timestamp]);

  const Component = () => {
    const someNew = transactions.some((transaction) => transaction.isNew);
    return (
      <div className="card" ref={ref}>
        {transactionsFetched === undefined && <Loader dataTestId="transactionsLoader" />}
        {transactionsFetched === false && <FailedTransactions />}
        {transactionsFetched === true && transactions.length === 0 && <NoTransactions />}
        {transactionsFetched === true && transactions.length > 0 && (
          <>
            <div className="card-header">
              <div className="card-header-item d-flex justify-content-between align-items-center">
                <h6 className="m-0">Latest Transactions</h6>
                <NetworkLink to="/transactions" className="mr-2">
                  View All Transactions
                </NetworkLink>
              </div>
            </div>
            <div className="card-body card-scroll py-0">
              <div className="animated-list" data-testid="transactionsList">
                {transactions.map((transaction, i) => (
                  <div
                    key={transaction.txHash}
                    className={`row animated-row ${transaction.isNew && someNew ? 'new' : ''}`}
                  >
                    <div className="col-6 pl-lg-spacer d-flex align-items-center">
                      <div className="list-item-icon mr-3">
                        <FontAwesomeIcon icon={faExchangeAlt} />
                      </div>
                      <div className="min-w-0">
                        <div className="d-flex align-items-center">
                          <ScAddressIcon
                            initiator={transaction.sender}
                            secondInitiator={transaction.receiver}
                          />

                          <NetworkLink
                            to={`/transactions/${transaction.txHash}`}
                            data-testid={`transactionLink${i}`}
                            className="trim-wrapper"
                          >
                            <Trim text={transaction.txHash} />
                          </NetworkLink>
                        </div>
                        <span
                          title={dateFormatted(transaction.timestamp)}
                          className="text-secondary"
                        >
                          <TimeAgo value={transaction.timestamp} />
                        </span>
                      </div>
                    </div>
                    <div className="col-6 pr-lg-spacer text-secondary">
                      <div className="d-flex align-items-center">
                        <span className="text-nowrap mr-2">From</span>

                        {addressIsBech32(transaction.sender) ? (
                          <NetworkLink
                            to={urlBuilder.accountDetails(transaction.sender)}
                            className="trim-wrapper"
                          >
                            <Trim text={transaction.sender} />
                          </NetworkLink>
                        ) : (
                          <ShardSpan shard={transaction.sender} />
                        )}
                      </div>
                      <div className="d-flex align-items-center">
                        <span className="text-nowrap mr-2">To</span>

                        <NetworkLink
                          to={urlBuilder.accountDetails(transaction.receiver)}
                          data-testid={`transactionLinkTo${i}`}
                          className="trim-wrapper"
                        >
                          <Trim text={transaction.receiver} />
                        </NetworkLink>
                      </div>
                    </div>
                  </div>
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
