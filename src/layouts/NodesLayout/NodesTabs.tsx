import { useSelector } from 'react-redux';

import { Tabs } from 'components/Tabs';
import { stakeSelector } from 'redux/selectors';
import { validatorsRoutes } from 'routes';

export const NodesTabs = () => {
  const { queueSize, auctionValidators } = useSelector(stakeSelector);

  const tabs = [
    {
      tabLabel: 'Validators',
      tabTo: validatorsRoutes.identities
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
      show: queueSize !== undefined,
      tabTo: validatorsRoutes.queue,
      tabLabel: 'Queue'
    },
    {
      show: auctionValidators !== undefined,
      tabTo: validatorsRoutes.auctionList,
      tabLabel: 'Auction List'
    }
  ];

  return (
    <div className='card-header-item nodes-tabs mb-3'>
      <Tabs tabs={tabs} />
    </div>
  );
};
