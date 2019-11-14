import * as React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useGlobalState } from '../../context';
import { getTransactions, getTotalTransactions } from './helpers/asyncRequests';
import { Pager, ShardSpan } from './../../sharedComponents';
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

function getDirection(type: string | undefined) {
  const shardMap: any = {
    'shard-from': 'senderShard',
    'shard-to': 'receiverShard',
    default: undefined,
  };
  return shardMap[String(type)] || shardMap['default'];
}

const Transactions: React.FC = () => {
  let ref = React.useRef(null);
  let addressRef = React.useRef(null);

  const {
    activeTestnet: { elasticUrl },
    refresh: { timestamp },
    timeout,
  } = useGlobalState();
  let { page, hash: addressId, shard } = useParams();
  const { pathname } = useLocation();

  const [transactions, setTransactions] = React.useState<TransactionType[]>([]);
  const [transactionsFetched, setTransactionsFetched] = React.useState<boolean>(true);
  const [totalTransactions, setTotalTransactions] = React.useState<number>(0);
  const size = parseInt(page!) ? parseInt(page!) : 1;
  const shardId = parseInt(shard!) >= 0 ? parseInt(shard!) : undefined;

  const locationArray = pathname.substr(1).split('/');
  const indexOfTransactions = locationArray.indexOf('transactions');
  const shardDirection = locationArray[indexOfTransactions + 1];

  const shardType = getDirection(shardDirection);

  const refreshFirstPage = size === 1 ? timestamp : 0;

  const fetchTransactions = () => {
    if (ref.current !== null) {
      getTransactions({ elasticUrl, size, addressId, shardId, shardType, timeout }).then(
        ({ data, success }) => {
          if (ref.current !== null) {
            if (success) {
              setTransactions(data);
              setTransactionsFetched(true);
            } else if (transactions.length === 0) {
              setTransactionsFetched(false);
            }
          }
        }
      );
      getTotalTransactions({ elasticUrl, addressId, shardId, timeout, shardType }).then(
        data => ref.current !== null && setTotalTransactions(data)
      );
    }
  };

  React.useEffect(fetchTransactions, [elasticUrl, size, addressId, timeout, refreshFirstPage]); // run the operation only once since the parameter does not change

  let slug = addressId ? `address/${addressId}` : 'transactions';
  slug = shardType ? `transactions/${shardDirection}/${shardId}` : slug;

  return (
    <div ref={ref}>
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
                    <h4>
                      Transactions
                      {shardId !== undefined && shardId >= 0 && (
                        <>
                          {shardDirection === 'shard-from' && <span>&nbsp;from&nbsp;</span>}
                          {shardDirection === 'shard-to' && <span>&nbsp;to&nbsp;</span>}
                          <ShardSpan shardId={shardId} />
                        </>
                      )}
                    </h4>
                  </div>
                </div>
                <div className="card" style={{ height: 'auto' }}>
                  <div className="card-body card-list">
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
                            <th scope="col" className="text-right">
                              Value
                            </th>
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

                    <Pager
                      slug={slug}
                      total={totalTransactions}
                      start={(size - 1) * 50}
                      end={(size - 1) * 50 + 50}
                      show={transactions.length > 0}
                    />
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
