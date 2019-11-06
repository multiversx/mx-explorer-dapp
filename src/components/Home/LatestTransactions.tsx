import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import { getTransactions } from './helpers/asyncRequests';
import { TestnetLink, TimeAgo } from './../../sharedComponents';
import { TransactionType } from './../Transactions';
import { useGlobalState } from '../../context';
import { truncate, dateFormatted } from './../../helpers';

const LatestTransactions: React.FC = () => {
  let ref = React.useRef(null);
  const {
    activeTestnet: { elasticUrl },
    timeout,
  } = useGlobalState();
  const [transactions, setTransactions] = React.useState<TransactionType[]>([]);
  const [transactionsFetched, setTransactionsFetched] = React.useState<boolean>(true);
  React.useEffect(() => {
    if (ref.current !== null) {
      getTransactions({ elasticUrl, timeout }).then(({ data, transactionsFetched }) => {
        setTransactions(data);
        setTransactionsFetched(transactionsFetched);
      });
    }
  }, [elasticUrl, timeout]);
  return (
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
            <TestnetLink to="/transactions/page/1">View All Transactions</TestnetLink>
          </div>
          <div className="card-scroll">
            {transactions.length ? (
              <div className="animated fadeIn">
                {transactions.map((transaction: TransactionType, i) => (
                  <div key={transaction.hash}>
                    <div className="row">
                      <div className="col-6">
                        <span className="icon-container-round">
                          <i>
                            <FontAwesomeIcon icon={faExchangeAlt} />
                          </i>
                        </span>
                        <TestnetLink to={`/transactions/${transaction.hash}`}>
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
                        <TestnetLink to={`/address/${transaction.sender}`}>
                          {truncate(transaction.sender, 20)}
                        </TestnetLink>
                        <br />
                        To&nbsp;
                        <TestnetLink to={`/address/${transaction.receiver}`}>
                          {truncate(transaction.receiver, 20)}
                        </TestnetLink>
                      </div>
                    </div>
                    {i !== transactions.length - 1 && <hr className="hr-space" />}
                  </div>
                ))}
              </div>
            ) : (
              <div className="row h-100 justify-content-center align-items-center">
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
export default LatestTransactions;
