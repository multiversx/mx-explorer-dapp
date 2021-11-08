import * as React from 'react';
import { Redirect, useLocation, useRouteMatch } from 'react-router-dom';
import { useGlobalDispatch, useGlobalState } from 'context';
import { Loader, adapter } from 'sharedComponents';
import FailedAccount from './FailedAccount';
import { addressIsBech32, useNetworkRoute, useSize } from 'helpers';
import AccountDetailsCard from './AccountDetailsCard';
import { accountsRoutes } from 'routes';

const AccountLayout = ({ children }: { children: React.ReactNode }) => {
  const ref = React.useRef(null);
  const { pathname } = useLocation();
  const { firstPageTicker } = useSize();
  const { activeNetwork } = useGlobalState();
  const dispatch = useGlobalDispatch();
  const { getAccount } = adapter();
  const networkRoute = useNetworkRoute();

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
