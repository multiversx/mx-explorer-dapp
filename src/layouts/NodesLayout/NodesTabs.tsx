import React from 'react';

import { Tabs } from 'components/Tabs';
import { useIsMainnet } from 'hooks';
import { validatorsRoutes } from 'routes';

export const NodesTabs = () => {
  const isMainnet = useIsMainnet();

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
