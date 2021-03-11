import React from 'react';
import { useGlobalState } from 'context';
import AccountTabs from './AccountTabs';
import { Redirect } from 'react-router-dom';
import { urlBuilder, useNetworkRoute } from 'helpers';

const AccountContract = () => {
  const { accountDetails } = useGlobalState();
  const networkRoute = useNetworkRoute();

  const hasCode = accountDetails && accountDetails.code;
  const address = accountDetails ? accountDetails.address : '';

  return !hasCode ? (
    <Redirect to={networkRoute(urlBuilder.accountDetails(address))} />
  ) : (
    <div className="card">
      <div className="card-header">
        <div className="card-header-item d-flex justify-content-between align-items-center">
          <AccountTabs />
        </div>
      </div>
      <div className="card-body">
        <textarea
          readOnly
          className="form-control col cursor-text"
          rows={10}
          defaultValue={accountDetails?.code}
        />
      </div>
    </div>
  );
};

export default AccountContract;
