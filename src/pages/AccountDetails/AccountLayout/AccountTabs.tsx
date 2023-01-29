import * as React from 'react';
import { useSelector } from 'react-redux';
import { NetworkLink } from 'components';
import { urlBuilder, isContract } from 'helpers';
import { useActiveRoute } from 'hooks';
import { activeNetworkSelector, accountSelector } from 'redux/selectors';
import { accountsRoutes } from 'routes';

export const AccountTabs = () => {
  const activeRoute = useActiveRoute();

  const { account } = useSelector(accountSelector);
  const { address, code } = account;
  const { adapter } = useSelector(activeNetworkSelector);

  const tokensRouteActive = adapter === 'api';

  return (
    <div className='tab-links d-flex flex-wrap gap-3'>
      <NetworkLink
        to={urlBuilder.accountDetails(address)}
        className={`tab-link ${
          activeRoute(accountsRoutes.accountDetails) ? 'active' : ''
        }`}
      >
        <h5>Transactions</h5>
      </NetworkLink>

      {tokensRouteActive && (
        <NetworkLink
          to={urlBuilder.accountDetailsTokens(address)}
          className={`tab-link ${
            activeRoute(accountsRoutes.accountTokens) ? 'active' : ''
          }`}
        >
          <h5>ESDT Tokens</h5>
        </NetworkLink>
      )}

      <NetworkLink
        to={urlBuilder.accountDetailsNfts(address)}
        className={`tab-link ${
          activeRoute(accountsRoutes.accountNfts) ? 'active' : ''
        }`}
      >
        <h5>NFTs</h5>
      </NetworkLink>

      {!isContract(address) && (
        <NetworkLink
          to={urlBuilder.accountDetailsStaking(address)}
          className={`tab-link ${
            activeRoute(accountsRoutes.accountStaking) ? 'active' : ''
          }`}
        >
          <h5>Staking</h5>
        </NetworkLink>
      )}

      <NetworkLink
        to={urlBuilder.accountDetailsAnalytics(address)}
        className={`tab-link ${
          activeRoute(accountsRoutes.accountAnalytics) ? 'active' : ''
        }`}
      >
        <h5>Analytics</h5>
      </NetworkLink>

      {!code && (
        <NetworkLink
          to={urlBuilder.accountDetailsContracts(address)}
          className={`tab-link ${
            activeRoute(accountsRoutes.accountContracts) ? 'active' : ''
          }`}
        >
          <h5>Smart Contracts</h5>
        </NetworkLink>
      )}

      {code && (
        <NetworkLink
          to={urlBuilder.accountDetailsContractCode(address)}
          className={`tab-link ${
            activeRoute(accountsRoutes.accountCode) ? 'active' : ''
          }`}
        >
          <h5>Code</h5>
        </NetworkLink>
      )}
    </div>
  );
};
