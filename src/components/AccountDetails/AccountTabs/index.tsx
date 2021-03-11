import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { NetworkLink } from 'sharedComponents';
import { urlBuilder } from 'helpers';
import { useGlobalState } from 'context';

const AccountTabs = () => {
  const activePath = useLocation().pathname;
  const { accountDetails } = useGlobalState();

  const address = accountDetails ? accountDetails.address : '';
  const code = accountDetails ? accountDetails.code : undefined;

  const indexActive = !activePath.endsWith('contract');

  return (
    <div className="account-tabs d-flex flex-row">
      <div>
        <NetworkLink
          to={urlBuilder.accountDetails(address)}
          className={`tab-link mr-3 ${indexActive ? 'active' : ''}`}
        >
          <h6>Transactions</h6>
        </NetworkLink>
      </div>
      {code && (
        <div>
          <NetworkLink
            to={urlBuilder.accountDetailsContract(address)}
            className={`tab-link ml-3 ${!indexActive ? 'active' : ''}`}
          >
            <h6>Contract</h6>
          </NetworkLink>
        </div>
      )}
    </div>
  );
};

export default AccountTabs;
