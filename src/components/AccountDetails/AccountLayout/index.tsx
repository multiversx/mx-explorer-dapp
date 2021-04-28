import * as React from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import { useGlobalDispatch, useGlobalState } from 'context';
import { Loader, adapter } from 'sharedComponents';
import FailedAccount from './FailedAccount';
import { addressIsBech32, useFilters, useNetworkRoute, useSize } from 'helpers';
import AccountDetailsCard from './AccountDetailsCard';
import { useRouteMatch } from 'react-router-dom';
import { accountsRoutes } from 'routes';

const AccountLayout = ({ children }: { children: React.ReactNode }) => {
  const ref = React.useRef(null);
  const { pathname } = useLocation();
  const { size } = useFilters();
  const { firstPageTicker } = useSize();
  const { activeNetwork, accountDetails } = useGlobalState();
  const dispatch = useGlobalDispatch();
  const { getAccount, getAccountTokens, getAccountTokensCount } = adapter();
  const networkRoute = useNetworkRoute();

  const tokensActive = activeNetwork.adapter === 'api';

  const isOldAddressRoute = pathname.includes('/address/');
  const oldMatch: any = useRouteMatch(networkRoute(accountsRoutes.oldAccountDetails));
  const oldAddress = oldMatch ? oldMatch.params.hash : undefined;

  const match: any = useRouteMatch(networkRoute(accountsRoutes.accountDetails));
  const address = match ? match.params.hash : undefined;

  const [dataReady, setDataReady] = React.useState<boolean | undefined>();

  const fetchBalanceAndCount = () => {
    if (!document.hidden) {
      getAccount(address).then((accountDetailsData) => {
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
  }, [firstPageTicker, activeNetwork.id, address]);

  const fetchAccountTokens = () => {
    if (tokensActive) {
      Promise.all([
        getAccountTokens({
          size,
          address,
        }),
        getAccountTokensCount(address),
      ]).then(([accountTokensData, accountTokensCountData]) => {
        if (ref.current !== null) {
          dispatch({
            type: 'setAccountTokens',
            accountTokens: {
              success: accountTokensData.success,
              data: accountTokensData.data,
              count: accountTokensCountData.success ? accountTokensCountData.data : 0,
            },
          });
        }
      });
    }
  };

  React.useEffect(() => {
    if (!isOldAddressRoute) {
      fetchAccountTokens();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountDetails.txCount, activeNetwork.id, address, size]);

  React.useEffect(() => {
    setDataReady(undefined);
  }, [address, activeNetwork.id]);

  const loading = dataReady === undefined;
  const failed = dataReady === false || !addressIsBech32(address);

  return isOldAddressRoute ? (
    <Redirect to={networkRoute(`/accounts/${oldAddress}`)} />
  ) : (
    <>
      {loading && <Loader />}
      {!loading && failed && <FailedAccount address={address} />}

      <div ref={ref}>
        {!loading && !failed && (
          <div className="container page-content">
            <AccountDetailsCard />
            {children}
          </div>
        )}
      </div>
    </>
  );
};

export default AccountLayout;
