import React from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { faCoins } from '@fortawesome/pro-solid-svg-icons/faCoins';
import { Denominate, DetailItem, Pager, PageState } from 'sharedComponents';
import { useGlobalState } from 'context';
import AccountTabs from './AccountLayout/AccountTabs';
import { urlBuilder, useFilters, useNetworkRoute } from 'helpers';

const AccountTokens = () => {
  const { activeNetwork, accountTokens } = useGlobalState();
  const { size } = useFilters();
  const networkRoute = useNetworkRoute();
  const { hash: address } = useParams() as any;
  const tokensActive = activeNetwork.id !== 'mainnet' && activeNetwork.adapter === 'api';

  return !tokensActive ? (
    <Redirect to={networkRoute(urlBuilder.accountDetails(address))} />
  ) : (
    <div className="card">
      <div className="card-header">
        <div className="card-header-item d-flex justify-content-between align-items-center">
          <AccountTabs />
        </div>
      </div>
      <div className="card-body px-lg-spacer py-lg-4">
        <div className="container-fluid">
          {accountTokens.success === false && (
            <PageState
              icon={faCoins}
              title="Unable to load tokens"
              className="py-spacer my-auto"
              dataTestId="errorScreen"
            />
          )}

          {accountTokens.success === true && accountTokens.data.length === 0 && (
            <PageState icon={faCoins} title="No tokens" className="py-spacer my-auto" />
          )}

          {accountTokens.success === true && accountTokens.data.length > 0 && (
            <>
              {accountTokens.data.map(({ token, name, balance, decimals }) => (
                <DetailItem title={name} key={token}>
                  <Denominate
                    value={balance ? balance : '0'}
                    showLastNonZeroDecimal={true}
                    token={token}
                    denomination={decimals}
                  />
                </DetailItem>
              ))}
              <div className="card-footer d-flex justify-content-end">
                <Pager
                  itemsPerPage={25}
                  page={String(size)}
                  total={accountTokens.count}
                  show={accountTokens.data.length > 0}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountTokens;
