import * as React from 'react';
import { useParams, Redirect } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import { useGlobalState } from '../../context';
import { getTransactions, getTotalTransactions } from './helpers/asyncRequests';
import { Highlights, Pager } from './../../sharedComponents';
import TransactionRow from './TransactionRow';

export type TransactionType = {
  blockHash: string;
  data: string;
  gasLimit: number;
  gasPrice: number;
  hash: string;
  miniBlockHash: string;
  nonce: number;
  receiver: string;
  receiverShard: number;
  round: number;
  sender: string;
  senderShard: number;
  signature: string;
  status: string;
  timestamp: number;
  value: string;
};

const Transactions: React.FC = () => {
  let ref = React.useRef(null);
  const {
    activeTestnet: { elasticUrl },
  } = useGlobalState();
  let { page } = useParams();
  const [transactions, setTransactions] = React.useState<TransactionType[]>([]);
  const [transactionsFetched, setTransactionsFetched] = React.useState<boolean>(true);
  const [totalTransactions, setTotalTransactions] = React.useState<number>(0);
  const size = !isNaN(page as any) ? parseInt(page as any) : 1;

  // https://www.polvara.me/posts/fetching-asynchronous-data-with-react-hooks/
  React.useEffect(() => {
    getTransactions({ elasticUrl, size }).then(({ data, success }) => {
      if (ref.current !== null) {
        setTransactions(data);
        setTransactionsFetched(success);
      }
    });
    getTotalTransactions(elasticUrl).then(
      data => ref.current !== null && setTotalTransactions(data)
    );
  }, [elasticUrl, size]); // run the operation only once since the parameter does not change

  const TransactionsPage = (
    <div ref={ref}>
      <Highlights />
      <div className="container pt-3 pb-3">
        <div className="row">
          <div className="col-12">
            <h4 data-testid="title">Transactions</h4>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="card">
              {!transactionsFetched ? (
                <div className="card-body card-details">
                  <div className="empty">
                    <FontAwesomeIcon icon={faExchangeAlt} className="empty-icon" />
                    <span className="h4 empty-heading">Unable to load transactions</span>
                  </div>
                </div>
              ) : (
                <div className="card-body card-list">
                  <Pager slug="transactions" />
                  {totalTransactions > 0 && (
                    <span>
                      More than {totalTransactions.toLocaleString('en')} transactions found
                    </span>
                  )}
                  <div className="table-responsive">
                    <table className="table mt-4" data-testid="transactionsTable">
                      <thead>
                        <tr>
                          <th scope="col">Txn Hash</th>
                          <th scope="col">Block</th>
                          <th scope="col">Age</th>
                          <th scope="col">Shard</th>
                          <th scope="col">From</th>
                          <th scope="col">To</th>
                          <th scope="col">Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map(transaction => (
                          <TransactionRow transaction={transaction} key={transaction.hash} />
                        ))}
                        {transactions.length === 0 && (
                          <tr>
                            <td colSpan={7} className="text-center pt-5 pb-4 border-0">
                              <div className="lds-ellipsis">
                                <div />
                                <div />
                                <div />
                                <div />
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  return isNaN(page as any) ? <Redirect to="/transactions/page/1" /> : TransactionsPage;
};

export default Transactions;
