import { addressIsBach32, hexPublicKeyFromAddress } from 'helpers';
import * as React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useGlobalState } from '../../context';
import { Loader, Pager, ShardSpan } from './../../sharedComponents';
import AddressDetails, { AddressDetailsType } from './AddressDetails';
import FailedAddress from './FailedAddress';
import FailedTransaction from './FailedTransaction';
import { getAddressDetails, getTotalTransactions, getTransactions } from './helpers/asyncRequests';
import NoTransactions from './NoTransactions';
import TransactionRow from './TransactionRow';

export interface TransactionType {
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
}

function getDirection(type: string | undefined) {
  const shardMap: any = {
    'shard-from': 'senderShard',
    'shard-to': 'receiverShard',
    default: undefined,
  };
  return shardMap[String(type)] || shardMap.default;
}

const initialAddressDetails: AddressDetailsType = {
  addressId: '',
  code: '',
  balance: '...',
  nonce: 0,
  detailsFetched: true,
};

const Transactions: React.FC = () => {
  const ref = React.useRef(null);
  const [addressDetails, setAddressDetails] = React.useState<AddressDetailsType>(
    initialAddressDetails
  );
  const [addressDetailsLoading, setAddressDetailsLoading] = React.useState<boolean>(true);

  const {
    activeTestnet: { elasticUrl, nodeUrl },
    refresh: { timestamp },
    timeout,
  } = useGlobalState();
  const { page, hash: addressId, shard } = useParams();
  const { pathname } = useLocation();

  const [transactions, setTransactions] = React.useState<TransactionType[]>([]);
  const [transactionsFetched, setTransactionsFetched] = React.useState<boolean>(true);
  const [totalTransactions, setTotalTransactions] = React.useState<number | string>('...');
  const size = parseInt(page!) ? parseInt(page!) : 1;
  const shardId = parseInt(shard!) >= 0 ? parseInt(shard!) : undefined;

  const locationArray = pathname.substr(1).split('/');
  const indexOfTransactions = locationArray.indexOf('transactions');
  const shardDirection = locationArray[indexOfTransactions + 1];

  const shardType = getDirection(shardDirection);

  const refreshFirstPage = size === 1 ? timestamp : 0;

  const address = addressIsBach32(addressId) ? hexPublicKeyFromAddress(addressId) : addressId;

  const fetchTransactions = () => {
    if (ref.current !== null) {
      getTransactions({
        elasticUrl,
        size,
        addressId: address,
        shardId,
        shardType,
        timeout,
      }).then(({ data, success }) => {
        if (ref.current !== null) {
          if (success) {
            setTransactions(data);
            setTransactionsFetched(true);
          } else if (transactions.length === 0) {
            setTransactionsFetched(false);
          }
        }
      });
      getTotalTransactions({
        elasticUrl,
        addressId: address,
        shardId,
        timeout,
        shardType,
      }).then(({ count, success }) => {
        if (ref.current !== null && success) {
          setTotalTransactions(count);
        }
      });
    }
  };

  const getAddrDetails = () => {
    if (addressId && ref.current !== null) {
      getAddressDetails({ nodeUrl, addressId: address, timeout }).then((data: any) => {
        if (ref.current !== null) {
          setAddressDetails(data);
          setAddressDetailsLoading(false);
        }
      });
    } else {
      setAddressDetailsLoading(false);
    }
  };

  React.useEffect(getAddrDetails, [nodeUrl, addressId, timeout]);

  React.useEffect(fetchTransactions, [elasticUrl, size, addressId, timeout, refreshFirstPage]); // run the operation only once since the parameter does not change

  let slug = addressId ? `address/${addressId}` : 'transactions';
  slug = shardType ? `transactions/${shardDirection}/${shardId}` : slug;

  const title = indexOfTransactions >= 0 ? 'Transactions' : 'Address Details';

  const Component = () => {
    return (
      <div ref={ref}>
        <div className="container pt-3 pb-3">
          <div className="row">
            <div className="col-12">
              <h4>
                <span data-testid="title">{title}</span>
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
          {addressDetailsLoading && addressDetails.detailsFetched && <Loader />}
          {!addressDetailsLoading && addressDetails.detailsFetched && (
            <>
              <AddressDetails {...addressDetails} />
              <div className="row">
                <div className="col-12">
                  {title !== 'Transactions' && (
                    <div className="row">
                      <div className="col-12">
                        <h4>
                          <span>Transactions</span>
                        </h4>
                      </div>
                    </div>
                  )}
                  {transactions.length > 0 ? (
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
                            </tbody>
                          </table>
                        </div>

                        <Pager
                          slug={slug}
                          total={totalTransactions}
                          start={(size - 1) * 50 + (size === 1 ? 1 : 0)}
                          end={
                            (size - 1) * 50 +
                            (parseInt(totalTransactions.toString()) < 50
                              ? parseInt(totalTransactions.toString())
                              : 50)
                          }
                          show={transactions.length > 0}
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      {transactionsFetched ? (
                        <Loader />
                      ) : (
                        pathname.includes('address') && <NoTransactions />
                      )}
                    </>
                  )}
                </div>
              </div>
            </>
          )}
          {!transactionsFetched &&
            addressDetails.balance === '0' &&
            addressDetails.nonce === 0 &&
            pathname.includes('address') && <FailedAddress addressId={addressId} />}
          {!transactionsFetched && pathname.includes('transactions') && <FailedTransaction />}
        </div>
      </div>
    );
  };
  return React.useMemo(Component, [transactions, transactionsFetched, addressDetailsLoading]);
};

export default Transactions;
