import * as React from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import { useGlobalDispatch, useGlobalState } from 'context';
import { Loader, adapter } from 'sharedComponents';
import FailedAccount from './FailedAccount';
import { addressIsBech32, useNetworkRoute, useSize } from 'helpers';
import AccountTokens from './AccountTokens';
import AccountInfo from './AccountInfo';
import { types } from 'helpers';

import { useRouteMatch } from 'react-router-dom';
import { accountRoutes } from 'routes';

const AccountLayout = ({ children }: { children: React.ReactNode }) => {
  const ref = React.useRef(null);
  const { pathname } = useLocation();
  const { firstPageTicker } = useSize();
  const { activeNetworkId, activeNetwork } = useGlobalState();
  const dispatch = useGlobalDispatch();
  const { getAccount, getAccountTokens } = adapter();
  const networkRoute = useNetworkRoute();

  const [dataReady, setDataReady] = React.useState<boolean | undefined>();

  const isOldAddressRoute = pathname.includes('/address/');
  const match: any = useRouteMatch(accountRoutes.index);
  const address = match ? match.params.hash : undefined;

  const fetchBalanceAndCount = () => {
    if (!document.hidden) {
      getAccount(address).then((accountDetailsData) => {
        if (ref.current !== null) {
          dispatch({
            type: 'setAccountDetails',
            accountDetails: accountDetailsData.success
              ? { ...accountDetailsData.data, detailsFetched: accountDetailsData.success }
              : {},
          });

          if (dataReady === undefined) {
            setDataReady(accountDetailsData.success);
          }
        }
      });
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
      fetchAccountTokens();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstPageTicker, activeNetworkId, address]);

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
                )}
              */}

            {accountTokensFetched === true && accountTokens.length > 0 && (
              <div className="row">
                <div className="col-12 mb-spacer">
                  <AccountTokens tokens={accountTokens} />
                </div>
              </div>
            )}

            {children}
          </div>
        )}
      </div>
    </>
  );
};

export default AccountLayout;
