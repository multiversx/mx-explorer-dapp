import * as React from 'react';
import { getTransactions, getTotalTransactions } from './helpers/asyncRequests';
import { useParams, Redirect } from 'react-router-dom';
import { useGlobalState } from '../../context';

import Highlights from './../../sharedComponents/Highlights';
import TransactionRow from './TransactionRow';
import Pager from './Pager';

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
  const { elasticUrl } = useGlobalState();
  let { page } = useParams();
  const [transactions, setTransactions] = React.useState<TransactionType[]>([]);
  const [totalTransactions, setTotalTransactions] = React.useState<number>(0);
  const size = !isNaN(page as any) ? parseInt(page as any) : 1;

  // https://www.polvara.me/posts/fetching-asynchronous-data-with-react-hooks/
  React.useEffect(() => {
    getTransactions({ elasticUrl, size }).then(setTransactions);
    getTotalTransactions(elasticUrl).then(setTotalTransactions);
  }, [elasticUrl, size]); // run the operation only once since the parameter does not change

  const TransactionsPage = (
    <div>
      <Highlights />
      <div className="container pt-3 pb-3">
        <div className="row">
          <div className="col-12">
            <h4 data-testid="title">Transactions</h4>
            {/* <span data-testid="nextPageButton">ASD</span> */}
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body card-list">
                <Pager />
                {totalTransactions > 0 && (
                  <span>More than {totalTransactions.toLocaleString('en')} transactions found</span>
                )}
                <div className="table-responsive">
                  <table className="table mt-4">
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
                        <TransactionRow
                          transaction={transaction}
                          key={transaction.hash + transaction.receiver}
                        />
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  return isNaN(page as any) ? <Redirect to="/transactions/page/1" /> : TransactionsPage;
};

export default Transactions;
