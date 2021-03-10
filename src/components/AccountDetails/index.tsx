import * as React from 'react';
import BigNumber from 'bignumber.js';
import { Redirect, useLocation, useParams } from 'react-router-dom';
import { useGlobalState } from 'context';
import { Loader, TransactionsTable, adapter } from 'sharedComponents';
import denominate from 'sharedComponents/Denominate/denominate';
import { TransactionType } from 'sharedComponents/TransactionsTable';
import txStatus from 'sharedComponents/TransactionStatus/txStatus';
import NoTransactions from 'sharedComponents/TransactionsTable/NoTransactions';
import FailedTransactions from 'sharedComponents/TransactionsTable/FailedTransactions';
import FailedAccountDetails from './FailedAccountDetails';
import { addressIsBech32, useNetworkRoute, useSize } from 'helpers';
import { denomination, decimals } from 'appConfig';
import { types } from 'helpers';
import AccountTokens from './AccountTokens';
import BalanceAndBasicInfo from './BalanceAndBasicInfo';

export interface AccountDetailsType extends types.AccountType {
  detailsFetched?: boolean;
  rewardsFetched?: boolean;
  claimableRewards?: number;
  stake?: number;
}

const initialAccountDetails: AccountDetailsType = {
  address: '',
  code: '',
  balance: '...',
  nonce: 0,
  detailsFetched: true,
  rewardsFetched: true,
  claimableRewards: 0,
  stake: 0,
};

const AccountDetails = () => {
  const ref = React.useRef(null);
  const { pathname } = useLocation();
  const isOldAddressRoute = pathname.includes('/address/');
  const { size, firstPageTicker } = useSize();
  const networkRoute = useNetworkRoute();

  const [accountDetails, setAccountDetails] = React.useState<AccountDetailsType>(
    initialAccountDetails
  );
  const [dataReady, setDataReady] = React.useState<boolean | undefined>();
  const [hasPendingTransaction, setHasPendingTransaction] = React.useState(false);

  const { activeNetworkId, activeNetwork } = useGlobalState();
  const { hash: address } = useParams() as any;

  const { getAccount, getTransactions, getRewards, getAccountTokens } = adapter();

  const [transactions, setTransactions] = React.useState<TransactionType[]>([]);
  const [transactionsFetched, setTransactionsFetched] = React.useState<boolean | undefined>();
  const [totalTransactions, setTotalTransactions] = React.useState<number | '...'>('...');

  const fetchBalanceAndCount = () => {
    if (!document.hidden) {
      getAccount(address).then((accountDetailsData) => {
        if (ref.current !== null) {
          setAccountDetails((existing) => ({
            ...existing,
            ...(accountDetailsData.success ? { ...accountDetailsData.data } : {}),
            detailsFetched: accountDetailsData.success,
          }));
          if (accountDetailsData.success) {
            setTotalTransactions(Math.min(accountDetailsData.data.txCount, 10000));
          }
          if (dataReady === undefined) {
            setDataReady(accountDetailsData.success);
          }
        }
      });
    }
  };

  const fetchTransactionsAndRewards = () => {
    Promise.all([
      getTransactions({
        size,
        address,
      }),
      getRewards(address),
    ]).then(([transactionsData, rewardsData]) => {
      const { data, success } = transactionsData;
      if (success) {
        const existingHashes = transactions.map((b) => b.txHash);
        const newTransactions = data.map((transaction: TransactionType) => ({
          ...transaction,
          isNew: !existingHashes.includes(transaction.txHash),
        }));
        if (ref.current !== null) {
          setTransactions(newTransactions);
          const pending = data.some(
            (tx: TransactionType) => tx.status.toLowerCase() === txStatus.pending.toLowerCase()
          );
          setHasPendingTransaction(pending);
          setTransactionsFetched(true);
        }
      } else if (transactions.length === 0) {
        if (ref.current !== null) {
          setTransactionsFetched(false);
        }
      }
      if (rewardsData.success) {
        const rewards = parseFloat(
          denominate({
            input: rewardsData.data.claimableRewards,
            decimals,
            denomination,
            showLastNonZeroDecimal: false,
            addCommas: false,
          })
        );
        const bNuserActiveStake = new BigNumber(rewardsData.data.userActiveStake);
        const bNuserWaitingStake = new BigNumber(rewardsData.data.userWaitingStake);
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

        if (ref.current !== null) {
          setAccountDetails((existing) => ({
            ...existing,
            rewardsFetched: rewardsData.success,
            claimableRewards: rewards,
            stake,
          }));
        }
      }
    });
  };

  const [accountTokens, setAccountTokens] = React.useState<types.TokenType[]>([]);
  const [accountTokensFetched, setAccountTokensFetched] = React.useState<boolean | undefined>();
  const fetchAccountTokens = () => {
    if (activeNetwork.id !== 'mainnet' && activeNetwork.adapter === 'api') {
      getAccountTokens(address).then(({ success, data }) => {
        if (ref.current !== null) {
          setAccountTokens(data);
          setAccountTokensFetched(success);
        }
      });
    }
  };

  React.useEffect(() => {
    if (!isOldAddressRoute) {
      fetchTransactionsAndRewards();
      fetchBalanceAndCount();
      fetchAccountTokens();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNetworkId, size, address]);

  React.useEffect(() => {
    if (!loading) {
      fetchBalanceAndCount();
      fetchAccountTokens();
      if (hasPendingTransaction) {
        fetchTransactionsAndRewards();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstPageTicker]);

  React.useEffect(() => {
    if (!loading) {
      fetchTransactionsAndRewards();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalTransactions, accountDetails.balance]);

  const loading = dataReady === undefined && transactionsFetched === undefined;
  const failed = dataReady === false || !addressIsBech32(address);
  const showTransactions = transactionsFetched === true && transactions.length > 0;

  return isOldAddressRoute ? (
    <Redirect to={networkRoute(`/accounts/${address}`)} />
  ) : (
    <>
      {loading && <Loader />}
      {!loading && failed && <FailedAccountDetails address={address} />}

      <div ref={ref}>
        {!loading && !failed && (
          <div className="container pt-spacer">
            <BalanceAndBasicInfo {...accountDetails} />

            {/* {accountTokensFetched === false && (
                  <div className="row">
                    <div className="col-12 mb-spacer">
                      <div className="card">
                        <div className="card-body p-0">
                          <FailedTokens />
                        </div>
                      </div>
                    </div>
                  </div>
                )} */}

            {accountTokensFetched === true && accountTokens.length > 0 && (
              <div className="row">
                <div className="col-12 mb-spacer">
                  <AccountTokens tokens={accountTokens} />
                </div>
              </div>
            )}

            <div className="row">
              <div className="col-12">
                {showTransactions ? (
                  <TransactionsTable
                    transactions={transactions}
                    address={address}
                    totalTransactions={totalTransactions}
                    size={size}
                    directionCol={true}
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

export default AccountDetails;
