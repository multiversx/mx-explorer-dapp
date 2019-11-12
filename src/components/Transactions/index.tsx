import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useGlobalState } from '../../context';
import { getTransactions, getTotalTransactions } from './helpers/asyncRequests';
import { Highlights, Pager } from './../../sharedComponents';
import TransactionRow from './TransactionRow';
import AddressDetails from './AddressDetails';
import FailedAddress from './FailedAddress';
import FailedTransaction from './FailedTransaction';

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
  let addressRef = React.useRef(null);

  const {
    activeTestnet: { elasticUrl },
    refresh: { timestamp },
    timeout,
  } = useGlobalState();
  let { page, hash: addressId } = useParams();
  const [transactions, setTransactions] = React.useState<TransactionType[]>([]);
  const [transactionsFetched, setTransactionsFetched] = React.useState<boolean>(true);
  const [totalTransactions, setTotalTransactions] = React.useState<number>(0);
  const size = parseInt(page!) ? parseInt(page!) : 1;

  const refreshFirstPage = size === 1 ? timestamp : 0;

  const fetchTransactions = () => {
    if (ref.current !== null) {
      getTransactions({ elasticUrl, size, addressId, timeout }).then(({ data, success }) => {
        if (ref.current !== null) {
          if (success) {
            setTransactions(data);
            setTransactionsFetched(true);
          } else if (transactions.length === 0) {
            setTransactionsFetched(false);
          }
        }
      });
      getTotalTransactions({ elasticUrl, addressId, timeout }).then(
        data => ref.current !== null && setTotalTransactions(data)
      );
    }
  };

  React.useEffect(fetchTransactions, [elasticUrl, size, addressId, timeout, refreshFirstPage]); // run the operation only once since the parameter does not change

  return (
    <div ref={ref}>
      <Highlights />
      <div className="container pt-3 pb-3">
        <div className={transactionsFetched ? '' : 'd-none'}>
          <AddressDetails reference={addressRef} />
        </div>

        <div className="row">
          <div className="col-12">
            {!transactionsFetched ? (
              <>
                {addressRef.current ? (
                  <FailedAddress addressId={addressId} />
                ) : (
                  <FailedTransaction />
                )}
              </>
            ) : (
              <>
                <div className="row">
                  <div className="col-12">
                    <h4 data-testid="title">Transactions</h4>
                  </div>
                </div>
                <div className="card">
                  <div className="card-body card-list">
                    <Pager slug={addressId ? `address/${addressId}` : 'transactions'} />
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
                            <TransactionRow
                              transaction={transaction}
                              key={transaction.hash}
                              addressId={addressId}
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
