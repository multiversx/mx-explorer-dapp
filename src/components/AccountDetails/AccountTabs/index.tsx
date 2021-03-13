import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { NetworkLink } from 'sharedComponents';
import { urlBuilder } from 'helpers';
import { useGlobalState } from 'context';

const AccountTabs = () => {
  const activePath = useLocation().pathname;
  const { accountDetails } = useGlobalState();

  const contractActive = activePath.endsWith('contract');
  const indexActive = !contractActive;

  return (
    <div className="account-tabs d-flex flex-row">
      <div>
        {indexActive ? (
          <div className="mr-3">
            <h6>Transactions</h6>
          </div>
        ) : (
          <NetworkLink
            to={urlBuilder.accountDetails(accountDetails.address)}
            className="tab-link mr-3"
          >
            <h6>Transactions</h6>
          </NetworkLink>
        )}
      </div>
      {accountDetails.code && (
        <>
          {contractActive ? (
            <div className="ml-3">
              <h6>Contract</h6>
            </div>
          ) : (
            <NetworkLink
              to={urlBuilder.accountDetailsContract(accountDetails.address)}
              className="tab-link ml-3"
            >
              <h6>Contract</h6>
            </NetworkLink>
          )}
        </>
      )}
    </div>
  );
};

export default AccountTabs;
