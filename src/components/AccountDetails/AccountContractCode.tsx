import React from 'react';
import { useGlobalState } from 'context';
import AccountTabs from './AccountTabs';
import { Redirect } from 'react-router-dom';
import { urlBuilder, useNetworkRoute } from 'helpers';

const AccountContractCode = () => {
  const { accountDetails } = useGlobalState();
  const networkRoute = useNetworkRoute();

  return !accountDetails.code ? (
    <Redirect to={networkRoute(urlBuilder.accountDetails(accountDetails.address))} />
  ) : (
    <div className="card">
      <div className="card-header">
        <div className="card-header-item d-flex justify-content-between align-items-center">
          <AccountTabs />
        </div>
      </div>
      <div className="card-body px-lg-spacer py-lg-4">
        <textarea
          readOnly
          className="form-control col cursor-text"
          rows={10}
          defaultValue={accountDetails.code}
        />
      </div>
    </div>
  );
};

export default AccountContractCode;
