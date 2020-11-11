import * as React from 'react';
import BigNumber from 'bignumber.js';
import { useParams } from 'react-router-dom';
import { useGlobalState } from 'context';
import { Loader, TransactionsTable, adapter } from 'sharedComponents';
import denominate from 'sharedComponents/Denominate/denominate';
import { TransactionType } from 'sharedComponents/TransactionsTable';
import txStatus from 'sharedComponents/TransactionStatus/txStatus';
import NoTransactions from 'sharedComponents/TransactionsTable/NoTransactions';
import FailedTransactions from 'sharedComponents/TransactionsTable/FailedTransactions';
import AddressDetails, { AddressDetailsType } from './AddressDetails';
import FailedAddress from './FailedAddress';
import DelegationDetails from './DelegationDetails';
import { addressIsBech32, useSize } from 'helpers';
import { denomination, decimals } from 'appConfig';

const initialAddressDetails: AddressDetailsType = {
  address: '',
  code: '',
  balance: '...',
  nonce: 0,
  detailsFetched: true,
  claimableRewards: 0,
  stake: 0,
};

const Address = () => {
  const ref = React.useRef(null);
  const { size, firstPageTicker } = useSize();

  const [addressDetails, setAddressDetails] = React.useState<AddressDetailsType>(
    initialAddressDetails
  );
  const [dataReady, setDataReady] = React.useState<boolean | undefined>();
  const [hasPendingTransaction, setHasPendingTransaction] = React.useState(false);

  const { activeNetworkId } = useGlobalState();
  const { hash: addressId } = useParams() as any;

  const { getAddressDetails, getTransactionsCount, getTransactions, getRewards } = adapter();

  const [transactions, setTransactions] = React.useState<TransactionType[]>([]);
  const [transactionsFetched, setTransactionsFetched] = React.useState<boolean | undefined>();
  const [totalTransactions, setTotalTransactions] = React.useState<number | '...'>('...');

  const fetchData = () => {
    Promise.all([
      getTransactions({
        size,
        addressId,
      }),
      getAddressDetails({ addressId }),
      getRewards({ addressId }),
    ]).then(([transactionsData, addressDetailsData, rewardsData]) => {
      const { data, success } = transactionsData;
      const { data: addressDetails } = addressDetailsData;
      if (success && ref.current !== null) {
        const existingHashes = transactions.map((b) => b.txHash);
        const newTransactions = data.map((transaction: TransactionType) => ({
          ...transaction,
          isNew: !existingHashes.includes(transaction.txHash),
        }));
        setTransactions(newTransactions);
        const pending = data.some(
          (tx: TransactionType) => tx.status.toLowerCase() === txStatus.pending.toLowerCase()
        );
        setHasPendingTransaction(pending);
        setTransactionsFetched(true);
      } else if (transactions.length === 0) {
        setTransactionsFetched(false);
      }
      setAddressDetails(({ stake, claimableRewards }) => ({
        ...addressDetails,
        detailsFetched: addressDetailsData.success,
        stake,
        claimableRewards,
      }));
      if (rewardsData.success) {
        const rewards = parseFloat(
          denominate({
            input: rewardsData.claimableRewards,
            decimals,
            denomination,
            showLastNonZeroDecimal: false,
            addCommas: false,
          })
        );
        const bNuserActiveStake = new BigNumber(rewardsData.userActiveStake);
        const bNuserWaitingStake = new BigNumber(rewardsData.userWaitingStake);
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
      setDataReady(addressDetailsData.success);
    });
  };

  const fetchTransactionsCount = () => {
    getTransactionsCount({
      addressId,
    }).then(({ count, success }) => {
      if (ref.current !== null && success) {
        setTotalTransactions(Math.min(count, 10000));
      }
    });
  };

  React.useEffect(() => {
    fetchData();
    fetchTransactionsCount();
  }, [activeNetworkId, size, addressId]);

  React.useEffect(() => {
    if (!loading) {
      fetchTransactionsCount();
      if (hasPendingTransaction) {
        fetchData();
      }
    }
  }, [firstPageTicker]);

  React.useEffect(() => {
    if (!loading) {
      fetchData();
    }
  }, [totalTransactions]);

  const loading = dataReady === undefined && transactionsFetched === undefined;
  const failed = addressDetails.detailsFetched === false || !addressIsBech32(addressId);
  const showTransactions = transactionsFetched === true && transactions.length > 0;

  return (
    <>
      {loading && <Loader />}
      {!loading && failed && <FailedAddress addressId={addressId} />}

      <div ref={ref}>
        {!loading && !failed && (
          <div className="container py-spacer">
            <div className="row page-header">
              <div className="col-12">
                <h3 className="page-title mb-4" data-testid="title">
                  Address Details
                </h3>
              </div>
            </div>
            <div className="row">
              <div className="col mb-spacer">
                <AddressDetails {...addressDetails} />
              </div>
              {addressDetails.stake > 0 && (
                <div className="col-lg-4 mb-spacer">
                  <DelegationDetails {...addressDetails} />
                </div>
              )}
            </div>

            <div className="row">
              <div className="col-12">
                {showTransactions ? (
                  <TransactionsTable
                    transactions={transactions}
                    addressId={addressId}
                    totalTransactions={totalTransactions}
                    size={size}
                    withTitle={true}
                  />
                ) : (
                  <div className="card">
                    {transactionsFetched === undefined && <Loader />}
                    {transactionsFetched === false && <FailedTransactions />}
                    {transactionsFetched === true && transactions.length === 0 && (
                      <NoTransactions />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Address;
