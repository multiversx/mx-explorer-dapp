import * as React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { NetworkLink } from 'sharedComponents';
import { urlBuilder } from 'helpers';

const AccountTabs = () => {
  const { hash: address } = useParams() as any;
  const activePath = useLocation().pathname;

  const transactionsActive = activePath.includes('transactions');
  const indexActive = !transactionsActive;

  return (
    <div className="provider-tabs d-flex flex-row">
      {indexActive ? (
        <div className="mr-3">
          <h6>Nodes</h6>
        </div>
      ) : (
        <NetworkLink to={urlBuilder.providerDetails(address)} className="tab-link mr-3">
          <h6>Nodes</h6>
        </NetworkLink>
      )}

      {transactionsActive ? (
        <div className="ml-3">
          <h6>Transactions</h6>
        </div>
      ) : (
        <NetworkLink to={urlBuilder.providerDetailsTransactions(address)} className="tab-link ml-3">
          <h6>Transactions</h6>
        </NetworkLink>
      )}
    </div>
  );
};

export default AccountTabs;
