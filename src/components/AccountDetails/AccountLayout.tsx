import * as React from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import { useGlobalDispatch, useGlobalState } from 'context';
import { Loader, adapter } from 'sharedComponents';
import FailedAccount from './FailedAccount';
import { addressIsBech32, useNetworkRoute, useSize } from 'helpers';
import AccountInfo from './AccountInfo';

import { useRouteMatch } from 'react-router-dom';
import { accountRoutes } from 'routes';

export interface LockedAmountType {
  stakeFetched?: boolean | undefined;
  totalStaked?: string;
  delegationFetched?: boolean | undefined;
  userActiveStake?: string;
  userDeferredPaymentStake?: string;
  userUnstakedStake?: string;
  userWaitingStake?: string;
  userWithdrawOnlyStake?: string;
  usd?: number;
}

const AccountLayout = ({ children }: { children: React.ReactNode }) => {
  const ref = React.useRef(null);
  const { pathname } = useLocation();
  const { firstPageTicker } = useSize();
  const { activeNetwork, accountDetails } = useGlobalState();
  const dispatch = useGlobalDispatch();
  const {
    getAccount,
    getAccountTokens,
    getAccountDelegation,
    getAccountStake,
    getEgldPrice,
  } = adapter();
  const networkRoute = useNetworkRoute();

  const tokensActive = activeNetwork.id !== 'mainnet' && activeNetwork.adapter === 'api';
  const isOldAddressRoute = pathname.includes('/address/');
  const match: any = useRouteMatch(accountRoutes.index);
  const urlAddress = match ? match.params.hash : undefined;

  const [dataReady, setDataReady] = React.useState<boolean | undefined>();
  const [lockedAmount, setLockedAmount] = React.useState<LockedAmountType>({
    stakeFetched: undefined,
    delegationFetched: undefined,
  });

  const fetchBalanceAndCount = () => {
    if (!document.hidden) {
      getAccount(urlAddress).then((accountDetailsData) => {
        const details = accountDetailsData.success ? accountDetailsData.data : {};

        if (ref.current !== null) {
          if (accountDetailsData.success) {
            dispatch({
              type: 'setAccountDetails',
              accountDetails: {
                ...details,
              },
            });
            setDataReady(true);
          }

          if (dataReady === undefined) {
            setDataReady(accountDetailsData.success);
          }
        }
      });
    }
  };

  React.useEffect(() => {
    if (!isOldAddressRoute) {
      fetchBalanceAndCount();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstPageTicker, activeNetwork.id, urlAddress]);

  const fetchLockedAmountAndPrice = () => {
    if (!document.hidden) {
      Promise.all([
        getAccountDelegation(urlAddress),
        getAccountStake(urlAddress),
        getEgldPrice(),
      ]).then(([delegationData, stakeData, priceData]) => {
        if (ref.current !== null) {
          const delegationFetched = delegationData.success ? delegationData.data : {};
          const stakeFetched = stakeData.success ? stakeData.data : {};
          const usd =
            priceData.success && priceData.data.length > 0
              ? priceData.data[priceData.data.length - 1].value
              : undefined;

          setLockedAmount({
            ...(delegationFetched ? delegationData.data : {}),
            ...(stakeFetched ? stakeData.data : {}),
            usd,
            delegationFetched,
            stakeFetched,
          });
        }
      });
    }
  };

  const fetchAccountTokens = () => {
    if (tokensActive) {
      getAccountTokens(urlAddress).then(({ success, data }) => {
        if (ref.current !== null) {
          dispatch({
            type: 'setAccountTokens',
            accountTokens: {
              success,
              data,
            },
          });
        }
      });
    }
  };

  React.useEffect(() => {
    if (!isOldAddressRoute) {
      fetchLockedAmountAndPrice();
      fetchAccountTokens();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountDetails.txCount, activeNetwork.id, urlAddress]);

  React.useEffect(() => {
    setDataReady(undefined);
  }, [urlAddress, activeNetwork.id]);

  const loading = dataReady === undefined;
  const failed = dataReady === false || !addressIsBech32(urlAddress);

  return isOldAddressRoute ? (
    <Redirect to={networkRoute(`/accounts/${urlAddress}`)} />
  ) : (
    <>
      {loading && <Loader />}
      {!loading && failed && <FailedAccount address={urlAddress} />}

      <div ref={ref}>
        {!loading && !failed && (
          <div className="container pt-spacer">
            <AccountInfo lockedAmount={lockedAmount} />
            {children}
          </div>
        )}
      </div>
    </>
  );
};

export default AccountLayout;
