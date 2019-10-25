import * as React from 'react';
import { getTransactions } from './helpers/asyncRequests';
import { useParams } from 'react-router-dom';
import { useCountState } from './../../context/context';

import Highlights from './Highlights';
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
  const { elasticUrl } = useCountState();
  let { page } = useParams();
  const size = !isNaN(page as any) ? parseInt(page as any) : 1;
  const [transactions, setTransactions] = React.useState<TransactionType[]>([]);
  React.useEffect(() => {
    getTransactions({ elasticUrl, size }).then(data => {
      const transactionsArray = data.hits.hits.map((transaction: any) => transaction._source);
      setTransactions(transactionsArray);
    });
  }, [elasticUrl, size]); // run the operation only once since the parameter does not change
  return (
    <div>
      <Highlights />
      <div className="container pt-3 pb-3">
        <div className="row">
          <div className="col-12">
            <h4>Transactions</h4>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body card-list">
                <Pager />
                More than 6,895,491 transactions found
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

                      <tr ng-show="!transactions">
                        <td colSpan={7} className="text-center pt-5 pb-4 border-0">
                          <div className="lds-ellipsis">
                            <div />
                            <div />
                            <div />
                            <div />
                          </div>
                        </td>
                      </tr>
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
};

export default Transactions;
