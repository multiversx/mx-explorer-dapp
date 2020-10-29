import * as React from 'react';
import BigNumber from 'bignumber.js';
import { useParams } from 'react-router-dom';
import { useGlobalState } from 'context';
import { Loader, TransactionsTable, adapter } from 'sharedComponents';
import denominate from 'sharedComponents/Denominate/denominate';
import { TransactionType } from 'sharedComponents/TransactionsTable';
import NoTransactions from 'sharedComponents/TransactionsTable/NoTransactions';
import FailedTransactions from 'sharedComponents/TransactionsTable/FailedTransactions';
import AddressDetails, { AddressDetailsType } from './AddressDetails';
import FailedAddress from './FailedAddress';
import DelegationDetails from './DelegationDetails';
import { addressIsBech32, useURLSearchParams } from 'helpers';
import { denomination, decimals } from 'appConfig';

const initialAddressDetails: AddressDetailsType = {
  addressId: '',
  code: '',
  balance: '...',
  nonce: 0,
  detailsFetched: true,
  claimableRewards: 0,
  stake: 0,
};

const Address = () => {
  const ref = React.useRef(null);
  const [addressDetails, setAddressDetails] = React.useState<AddressDetailsType>(
    initialAddressDetails
  );
  const [addressDetailsFetched, setAddressDetailsFetched] = React.useState<boolean | undefined>();

  const {
    activeNetworkId,
    refresh: { timestamp },
  } = useGlobalState();
  const { hash: addressId } = useParams() as any;
  const { page } = useURLSearchParams();

  const { getAddressDetails, getTransactionsCount, getTransactions, getRewards } = adapter();

  const [transactions, setTransactions] = React.useState<TransactionType[]>([]);
  const [transactionsFetched, setTransactionsFetched] = React.useState<boolean | undefined>();
  const [totalTransactions, setTotalTransactions] = React.useState<number | '...'>('...');
  const size = page !== undefined ? page : 1;

  const refreshFirstPage = size === 1 ? timestamp : 0;

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
      if (success && ref.current !== null) {
        setTransactions(data);
        setTransactionsFetched(true);
      } else if (transactions.length === 0) {
        setTransactionsFetched(false);
      }
      setAddressDetails(({ stake, claimableRewards }) => ({
        ...addressDetailsData,
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
      setAddressDetailsFetched(true);
    });
    getTransactionsCount({
      addressId,
    }).then(({ count, success }) => {
      if (ref.current !== null && success) {
        setTotalTransactions(Math.min(count, 10000));
      }
    });
  };

  React.useEffect(fetchData, [activeNetworkId, size, addressId, refreshFirstPage]); // run the operation only once since the parameter does not change

  const loading = addressDetailsFetched === undefined && transactionsFetched === undefined;

  const failed = addressDetails.detailsFetched === false || !addressIsBech32(addressId);

  return (
    <div ref={ref}>
      <div className="container py-spacer">
        {(loading || failed) && (
          <>
            <div className="row page-header mb-spacer">
              <div className="col-12">
                <h3 className="page-title" data-testid="title">
                  Address Details
                </h3>
              </div>
            </div>
            {loading ? <Loader dataTestId="loader" /> : <FailedAddress addressId={addressId} />}
          </>
        )}
        {!loading && !failed && (
          <>
            <div className="row page-header">
              <div
                className={`d-flex flex-column
                  ${addressDetails.stake > 0 ? 'col-lg-8' : 'col-12'}
                `}
              >
                <h3 className="page-title mb-spacer" data-testid="title">
                  Address Details
                </h3>
                <div className="mb-spacer flex-fill">
                  <AddressDetails {...addressDetails} />
                </div>
              </div>
              {addressDetails.stake > 0 && (
                <div className="col-lg-4 d-flex flex-column">
                  <h3 className="page-title mb-spacer">Delegation</h3>
                  <div className="mb-spacer flex-fill">
                    <DelegationDetails {...addressDetails} />
                  </div>
                </div>
              )}
            </div>
            <div className="row">
              <div className="col-12">
                <div className="row page-header mb-spacer">
                  <div className="col-12">
                    <h3 className="page-title">Transactions</h3>
                  </div>
                </div>
                {transactionsFetched === true ? (
                  <>
                    {transactions.length > 0 ? (
                      <TransactionsTable
                        transactions={transactions}
                        addressId={addressId}
                        totalTransactions={totalTransactions}
                        size={size}
                      />
                    ) : (
                      <NoTransactions />
                    )}
                  </>
                ) : (
                  <FailedTransactions />
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Address;
