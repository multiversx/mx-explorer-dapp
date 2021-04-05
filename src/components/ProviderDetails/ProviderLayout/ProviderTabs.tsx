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
      <NetworkLink
        to={urlBuilder.providerDetails(address)}
        className={`tab-link mr-3 ${indexActive ? 'active' : ''}`}
      >
        <h6>Nodes</h6>
      </NetworkLink>

      <NetworkLink
        to={urlBuilder.providerDetailsTransactions(address)}
        className={`tab-link ml-3 ${transactionsActive ? 'active' : ''}`}
      >
        <h6>Transactions</h6>
      </NetworkLink>
    </div>
  );
};

export default AccountTabs;
