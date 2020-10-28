import * as React from 'react';
import BigNumber from 'bignumber.js';
import { useLocation, useParams } from 'react-router-dom';
import { useGlobalState } from 'context';
import { Loader, ShardSpan, TransactionsTable, adapter } from 'sharedComponents';
import denominate from 'sharedComponents/Denominate/denominate';
import { TransactionType } from 'sharedComponents/TransactionsTable';
import NoTransactions from 'sharedComponents/TransactionsTable/NoTransactions';
import AddressDetails, { AddressDetailsType } from './AddressDetails';
import FailedAddress from './FailedAddress';
import FailedTransaction from './FailedTransaction';
import DelegationDetails from './DelegationDetails';
import { addressIsBech32 } from 'helpers';
import { denomination, decimals } from 'appConfig';

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
  claimableRewards: 0,
  stake: 0,
};

const Transactions = () => {
  const ref = React.useRef(null);
  const [addressDetails, setAddressDetails] = React.useState<AddressDetailsType>(
    initialAddressDetails
  );
  const [addressDetailsLoading, setAddressDetailsLoading] = React.useState<boolean>(true);

  const {
    activeNetworkId,
    refresh: { timestamp },
  } = useGlobalState();
  const { page, hash: addressId, shard } = useParams() as any;
  const { pathname } = useLocation();

  const { getAddressDetails, getTransactionsCount, getTransactions, getRewards } = adapter();

  const [transactions, setTransactions] = React.useState<TransactionType[]>([]);
  const [transactionsFetched, setTransactionsFetched] = React.useState<boolean>(true);
  const [totalTransactions, setTotalTransactions] = React.useState<number | '...'>('...');
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
        size,
        addressId,
        shardId,
        shardType,
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
      getTransactionsCount({
        addressId,
        shardId,
        shardType,
      }).then(({ count, success }) => {
        if (ref.current !== null && success) {
          setTotalTransactions(Math.min(count, 10000));
        }
      });
    }
  };

  const getAddrDetails = () => {
    if (addressId && ref.current !== null) {
      getAddressDetails({ addressId }).then((data: any) => {
        if (ref.current !== null) {
          setAddressDetails(({ stake, claimableRewards }) => ({
            ...data,
            stake,
            claimableRewards,
          }));
          getRewards({ addressId }).then((data) => {
            if (data.success) {
              const rewards = parseFloat(
                denominate({
                  input: data.claimableRewards,
                  decimals,
                  denomination,
                  showLastNonZeroDecimal: false,
                  addCommas: false,
                })
              );
              const bNuserActiveStake = new BigNumber(data.userActiveStake);
              const bNuserWaitingStake = new BigNumber(data.userWaitingStake);
              const bNstake = bNuserActiveStake.plus(bNuserWaitingStake);
              const stake = parseFloat(
                denominate({
                  input: bNstake.toString(10),
                  decimals,
                  denomination,
                  showLastNonZeroDecimal: false,
                  addCommas: false,
                })
              );
              setAddressDetails((details) => ({ ...details, claimableRewards: rewards, stake }));
            }
            setAddressDetailsLoading(false);
          });
        }
      });
    } else {
      setAddressDetailsLoading(false);
    }
  };

  React.useEffect(getAddrDetails, [activeNetworkId, addressId]);

  React.useEffect(fetchTransactions, [activeNetworkId, size, addressId, refreshFirstPage]); // run the operation only once since the parameter does not change

  let slug = addressId ? `address/${addressId}` : 'transactions';
  slug = shardType ? `transactions/${shardDirection}/${shardId}` : slug;

  const title = indexOfTransactions >= 0 ? 'Transactions' : 'Address Details';

  const PageData = () => (
    <>
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

  const loader = addressDetailsLoading && addressDetails.detailsFetched;

  const ComponentState = () => {
    switch (true) {
      case loader:
        return <Loader />;
      case !addressIsBech32(addressId) && pathname.includes('address'):
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
            <div className={addressDetails.stake > 0 ? 'col-lg-8' : 'col-12'}>
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
              {!loader && (
                <div className="row mb-4">
                  <AddressDetails {...{ ...addressDetails, addressId: addressId || '' }} />
                </div>
              )}
            </div>
            {addressDetails.stake > 0 && (
              <div className="col-lg-4">
                <h4>Delegation</h4>
                <div className="row mb-4">
                  <DelegationDetails {...{ ...addressDetails, addressId: addressId || '' }} />
                </div>
              </div>
            )}
          </div>
          <ComponentState />
        </div>
      </div>
    );
  };
  return React.useMemo(Component, [transactions, transactionsFetched, addressDetailsLoading]);
};

export default Transactions;
