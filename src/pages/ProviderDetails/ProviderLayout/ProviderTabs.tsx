import * as React from 'react';
import { useParams } from 'react-router-dom';
import { NetworkLink } from 'components';
import { urlBuilder, useActiveRoute } from 'helpers';
import { validatorsRoutes } from 'routes';

export const ProviderTabs = () => {
  const { hash: address } = useParams() as any;
  const activeRoute = useActiveRoute();

  return (
    <div className="provider-tabs d-flex flex-row">
      <NetworkLink
        to={urlBuilder.providerDetails(address)}
        className={`tab-link me-3 ${activeRoute(validatorsRoutes.providerDetails) ? 'active' : ''}`}
      >
        <h6>Nodes</h6>
      </NetworkLink>

      <NetworkLink
        to={urlBuilder.providerDetailsTransactions(address)}
        className={`tab-link ms-3 ${
          activeRoute(validatorsRoutes.providerTransactions) ? 'active' : ''
        }`}
      >
        <h6>Transactions</h6>
      </NetworkLink>
    </div>
  );
};
