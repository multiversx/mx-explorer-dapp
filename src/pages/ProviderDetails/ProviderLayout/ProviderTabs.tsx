import * as React from 'react';
import { useParams } from 'react-router-dom';
import { NetworkLink } from 'components';
import { urlBuilder, useActiveRoute } from 'helpers';
import { validatorsRoutes } from 'routes';

export const ProviderTabs = () => {
  const { hash: address } = useParams() as any;
  const activeRoute = useActiveRoute();

  return (
    <div className='provider-tabs tab-links d-flex flex-row flex-wrap'>
      <NetworkLink
        to={urlBuilder.providerDetails(address)}
        className={`tab-link me-3 me-lg-4 ${
          activeRoute(validatorsRoutes.providerDetails) ? 'active' : ''
        }`}
      >
        <h5>Nodes</h5>
      </NetworkLink>

      <NetworkLink
        to={urlBuilder.providerDetailsTransactions(address)}
        className={`tab-link me-3 me-lg-4 ${
          activeRoute(validatorsRoutes.providerTransactions) ? 'active' : ''
        }`}
      >
        <h5>Transactions</h5>
      </NetworkLink>
    </div>
  );
};
