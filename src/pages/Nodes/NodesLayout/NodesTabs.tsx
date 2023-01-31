import * as React from 'react';
import { NetworkLink } from 'components';
import { useIsMainnet, useActiveRoute } from 'hooks';
import { validatorsRoutes } from 'routes';
import { Tabs } from 'components/Tabs';

export const NodesTabs = () => {
  const isMainnet = useIsMainnet();
  const activeRoute = useActiveRoute();

  const tabs = [
    {
      tabLabel: 'Validators',
      tabTo: validatorsRoutes.identities,
      show: isMainnet
    },
    {
      tabTo: validatorsRoutes.providers,
      tabLabel: 'Staking Providers'
    },
    {
      tabTo: validatorsRoutes.nodes,
      tabLabel: 'Nodes'
    },
    {
      tabTo: validatorsRoutes.statistics,
      tabLabel: 'Statistics'
    },
    {
      tabTo: validatorsRoutes.queue,
      tabLabel: 'Queue'
    }
  ];

  return (
    <div className='card-header-item nodes-tabs mb-3'>
      <Tabs tabs={tabs} />
    </div>
  );
};
