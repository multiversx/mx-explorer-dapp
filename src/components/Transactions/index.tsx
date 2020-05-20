import * as React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useGlobalState } from 'context';
import { Loader, ShardSpan, TransactionsTable } from 'sharedComponents';
import { TransactionType } from 'sharedComponents/TransactionsTable';
import NoTransactions from 'sharedComponents/TransactionsTable/NoTransactions';
import AddressDetails, { AddressDetailsType } from './AddressDetails';
import FailedAddress from './FailedAddress';
import FailedTransaction from './FailedTransaction';
import { getAddressDetails, getTotalTransactions, getTransactions } from './helpers/asyncRequests';

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

const Transactions = () => {
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

  const fetchTransactions = () => {
    if (ref.current !== null) {
      getTransactions({
        elasticUrl,
        size,
        addressId,
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
        addressId,
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
      getAddressDetails({ nodeUrl, addressId, timeout }).then((data: any) => {
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

  const PageData = () => (
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
            <TransactionsTable
              transactions={transactions}
              addressId={addressId}
              totalTransactions={totalTransactions}
              slug={slug}
              size={size}
            />
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
  );

  const ComponentState = () => {
    switch (true) {
      case addressDetailsLoading && addressDetails.detailsFetched:
        return <Loader />;
      case !transactionsFetched &&
        addressDetails.balance === '0' &&
        addressDetails.nonce === 0 &&
        pathname.includes('address'):
        return <FailedAddress addressId={addressId} />;
      case !transactionsFetched && pathname.includes('transactions'):
        return <FailedTransaction />;
      case !addressDetailsLoading && addressDetails.detailsFetched:
        return <PageData />;
      default:
        return null;
    }
  };

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
          <ComponentState />
        </div>
      </div>
    );
  };
  return React.useMemo(Component, [transactions, transactionsFetched, addressDetailsLoading]);
};

export default Transactions;
