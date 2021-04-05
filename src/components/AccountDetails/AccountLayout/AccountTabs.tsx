import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { NetworkLink } from 'sharedComponents';
import { urlBuilder } from 'helpers';
import { useGlobalState } from 'context';

const AccountTabs = () => {
  const activePath = useLocation().pathname;
  const { accountDetails, activeNetwork } = useGlobalState();
  const tokensRouteActive = activeNetwork.id !== 'mainnet' && activeNetwork.adapter === 'api';

  const contractActive = activePath.endsWith('code');
  const tokensActive = activePath.includes('tokens');
  const indexActive = !contractActive && !tokensActive;

  return (
    <div className="account-tabs d-flex flex-row">
      <NetworkLink
        to={urlBuilder.accountDetails(accountDetails.address)}
        className={`tab-link mr-3 ${indexActive ? 'active' : ''}`}
      >
        <h6>Transactions</h6>
      </NetworkLink>

      {tokensRouteActive && (
        <NetworkLink
          to={urlBuilder.accountDetailsTokens(accountDetails.address)}
          className={`tab-link mx-3 ${tokensActive ? 'active' : ''}`}
        >
          <h6>ESDT Tokens</h6>
        </NetworkLink>
      )}
      {accountDetails.code && (
        <NetworkLink
          to={urlBuilder.accountDetailsContractCode(accountDetails.address)}
          className={`tab-link ml-3 ${contractActive ? 'active' : ''}`}
        >
          <h6>Code</h6>
        </NetworkLink>
      )}
    </div>
  );
};

export default AccountTabs;
