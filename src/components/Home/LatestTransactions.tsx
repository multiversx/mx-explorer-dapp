import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { useGlobalState } from '../../context';
import { addressIsHash, dateFormatted, trimHash, truncate } from './../../helpers';
import { ShardSpan, TestnetLink, TimeAgo } from './../../sharedComponents';
import { TransactionType } from './../Transactions';
import { getTransactions } from './helpers/asyncRequests';

const LatestTransactions: React.FC = () => {
  const ref = React.useRef(null);
  const {
    activeTestnet: { elasticUrl },
    timeout,
    refresh: { timestamp },
  } = useGlobalState();
  const [transactions, setTransactions] = React.useState<TransactionType[]>([]);
  const [transactionsFetched, setTransactionsFetched] = React.useState<boolean>(true);

  const fetchTransactions = () => {
    if (ref.current !== null) {
      getTransactions({ elasticUrl, timeout: timeout * 2 }).then(
        ({ data, transactionsFetched }) => {
          if (ref.current !== null) {
            if (transactionsFetched) {
              setTransactions(data);
              setTransactionsFetched(true);
            } else if (transactions.length === 0) {
              setTransactionsFetched(false);
            }
          }
        }
      );
    }
  };

  React.useEffect(fetchTransactions, [elasticUrl, timestamp]);

  const Component = () => (
    <div className="card" ref={ref}>
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
          <div className="card-scroll">
            {transactions.length ? (
              <div className="animated fadeIn" data-testid="transactionsList">
                {transactions.map((transaction: TransactionType, i) => (
                  <div key={transaction.hash}>
                    <div className="row">
                      <div className="col-6">
                        <span className="icon-container-round">
                          <i>
                            <FontAwesomeIcon icon={faExchangeAlt} />
                          </i>
                        </span>
                        <TestnetLink
                          to={`/transactions/${transaction.hash}`}
                          data-testid={`transactionLink${i}`}
                        >
                          {truncate(transaction.hash, 20)}
                        </TestnetLink>
                        <br />
                        <span
                          className="text-secondary"
                          title={dateFormatted(transaction.timestamp)}
                        >
                          <TimeAgo value={transaction.timestamp} />
                        </span>
                      </div>
                      <div className="col-6">
                        From&nbsp;
                        {addressIsHash(transaction.sender) ? (
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
                    {i !== transactions.length - 1 && <hr className="hr-space" />}
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
  return React.useMemo(Component, [transactions, transactionsFetched]);
};
export default LatestTransactions;
