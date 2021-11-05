import React from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { faCoins } from '@fortawesome/pro-solid-svg-icons/faCoins';
import { adapter, TokenBlock, DetailItem, Loader, Pager, PageState } from 'sharedComponents';
import { useGlobalState } from 'context';
import AccountTabs from './AccountLayout/AccountTabs';
import { urlBuilder, useFilters, useNetworkRoute } from 'helpers';
import { TokenType } from 'helpers/types';

const AccountTokens = () => {
  const ref = React.useRef(null);
  const { activeNetwork, accountDetails } = useGlobalState();
  const { size } = useFilters();
  const networkRoute = useNetworkRoute();

  const { getAccountTokens, getAccountTokensCount } = adapter();

  const { hash: address } = useParams() as any;
  const tokensActive = activeNetwork.adapter === 'api';

  const [dataReady, setDataReady] = React.useState<boolean | undefined>();
  const [accountTokens, setAccountTokens] = React.useState<TokenType[]>([]);
  const [accountTokensCount, setAccountTokensCount] = React.useState(0);

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
          if (accountTokensData.success && accountTokensCountData.success) {
            setAccountTokens(accountTokensData.data);
            setAccountTokensCount(accountTokensCountData.data);
          }
          setDataReady(accountTokensData.success && accountTokensCountData.success);
        }
      });
    }
  };

  React.useEffect(() => {
    fetchAccountTokens();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountDetails.txCount, activeNetwork.id, address, size]);

  return !tokensActive ? (
    <Redirect to={networkRoute(urlBuilder.accountDetails(address))} />
  ) : (
    <div className="card" ref={ref}>
      <div className="card-header">
        <div className="card-header-item d-flex justify-content-between align-items-center">
          <AccountTabs />
          {dataReady === true && accountTokens.length > 0 && (
            <div className="d-none d-md-flex">
              <Pager
                itemsPerPage={25}
                page={String(size)}
                total={accountTokensCount}
                show={accountTokens.length > 0}
              />
            </div>
          )}
        </div>
      </div>
      <div className="card-body pt-0 px-lg-spacer py-lg-4">
        <div className="container-fluid">
          {dataReady === undefined && <Loader dataTestId="tokensLoader" />}
          {dataReady === false && (
            <PageState
              icon={faCoins}
              title="Unable to load tokens"
              className="py-spacer my-auto"
              dataTestId="errorScreen"
            />
          )}
          {dataReady === true && accountTokens.length === 0 && (
            <PageState icon={faCoins} title="No tokens" className="py-spacer my-auto" />
          )}

          {dataReady === true && accountTokens.length > 0 && (
            <>
              {accountTokens.map(({ identifier, name, balance }) => {
                return (
                  <DetailItem title={name} key={identifier}>
                    <TokenBlock
                      identifier={identifier}
                      value={balance ? balance : '0'}
                      showLastNonZeroDecimal={true}
                    />
                  </DetailItem>
                );
              })}
            </>
          )}
        </div>
      </div>
      <div className="card-footer d-flex justify-content-end border-0 pt-0">
        {dataReady === true && accountTokens.length > 0 && (
          <Pager
            itemsPerPage={25}
            page={String(size)}
            total={accountTokensCount}
            show={accountTokens.length > 0}
          />
        )}
      </div>
    </div>
  );
};

export default AccountTokens;
