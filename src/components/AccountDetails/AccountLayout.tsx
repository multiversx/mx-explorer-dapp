import * as React from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import { useGlobalDispatch, useGlobalState } from 'context';
import { Loader, adapter } from 'sharedComponents';
import FailedAccount from './FailedAccount';
import { addressIsBech32, useNetworkRoute, useSize } from 'helpers';
import AccountInfo from './AccountInfo';
import { types } from 'helpers';

import { useRouteMatch } from 'react-router-dom';
import { accountRoutes } from 'routes';

const AccountLayout = ({ children }: { children: React.ReactNode }) => {
  const ref = React.useRef(null);
  const { pathname } = useLocation();
  const { firstPageTicker } = useSize();
  const { activeNetwork, accountDetails } = useGlobalState();
  const dispatch = useGlobalDispatch();
  const { getAccount, getAccountTokens, getAccountDelegation, getAccountStake } = adapter();
  const networkRoute = useNetworkRoute();

  const [dataReady, setDataReady] = React.useState<boolean | undefined>();

  const isOldAddressRoute = pathname.includes('/address/');
  const match: any = useRouteMatch(accountRoutes.index);
  const address = match ? match.params.hash : undefined;

  const fetchBalanceAndCount = () => {
    if (!document.hidden) {
      getAccount(address).then((accountDetailsData) => {
        if (ref.current !== null) {
          const details = accountDetailsData.success ? accountDetailsData.data : {};

          dispatch({
            type: 'setAccountDetails',
            accountDetails: {
              ...accountDetails,
              ...details,
            },
          });

          if (dataReady === undefined) {
            setDataReady(accountDetailsData.success);
          }
        }
      });
    }
  };

  const fetchLockedAmount = () => {
    if (!document.hidden) {
      Promise.all([getAccountDelegation(address), getAccountStake(address)]).then(
        ([delegationData, stakeData]) => {
          if (ref.current !== null) {
            const delegation = delegationData.success ? delegationData.data : {};
            const stake = stakeData.success ? stakeData.data : {};

            dispatch({
              type: 'setAccountDetails',
              accountDetails: {
                ...accountDetails,
                ...delegation,
                ...stake,
              },
            });
          }
        }
      );
    }
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
      fetchBalanceAndCount();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstPageTicker, activeNetwork.id, address]);

  React.useEffect(() => {
    if (!isOldAddressRoute) {
      fetchLockedAmount();
      // fetchAccountTokens();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNetwork.id, address, accountDetails?.txCount]);

  React.useEffect(() => {
    setDataReady(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNetwork.id, address]);

  const loading = dataReady === undefined;
  const failed = dataReady === false || !addressIsBech32(address);

  return isOldAddressRoute ? (
    <Redirect to={networkRoute(`/accounts/${address}`)} />
  ) : (
    <>
      {loading && <Loader />}
      {!loading && failed && <FailedAccount address={address} />}

      <div ref={ref}>
        {!loading && !failed && (
          <div className="container pt-spacer">
            <AccountInfo />
            {children}
          </div>
        )}
      </div>
    </>
  );
};

export default AccountLayout;
