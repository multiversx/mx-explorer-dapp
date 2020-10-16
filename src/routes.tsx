import React from 'react';
import BlockDetails from './components/BlockDetails';
import Blocks from './components/Blocks';
import EmptySearch from './components/EmptySearch';
import Home from './components/Home';
import MiniBlockDetails from './components/MiniBlockDetails';
import TransactionDetails from './components/TransactionDetails';
import Transactions from './components/Transactions';
import Nodes from './components/Nodes';
import Identities from './components/Identities';
import ValidatorsTable from './components/Validators/ValidatorsTable';
import BrandDetails from './components/Validators/BrandDetails';
import ValidatorDetails from './components/Validators/ValidatorDetails';
import ValidatorsBrandTable from './components/Validators/ValidatorsBrandTable';
import { withPageTitle, withNetworkReady } from './sharedComponents';

interface RouteType {
  path: string;
  title: string;
  component: any;
}

// INFO: to split the app in chunks use:
// component: React.lazy(() => import('./components/Validators')),

export const validatorsRoutes = {
  index: '/validators',
  brandDetails: `/validators/:identity`,
  nodes: '/validators/nodes',
  validatorDetails: '/validators/nodes/:hash',
};

const routes: RouteType[] = [
  {
    path: '/transactions/page/:page',
    title: 'Transactions',
    component: Transactions,
  },
  {
    path: '/transactions',
    title: 'Transactions',
    component: Transactions,
  },
  {
    path: '/nodes',
    title: 'Nodes',
    component: Nodes,
  },
  {
    path: '/validators',
    title: 'Validators',
    component: Identities,
  },
  // {
  //   path: validatorsRoutes.index,
  //   title: 'Validators',
  //   component: ValidatorsBrandTable,
  // },
  // {
  //   path: validatorsRoutes.nodes,
  //   title: 'Validators Nodes',
  //   component: ValidatorsTable,
  // },
  // {
  //   path: validatorsRoutes.brandDetails,
  //   title: 'Validator Details',
  //   component: BrandDetails,
  // },
  // {
  //   path: validatorsRoutes.validatorDetails,
  //   title: 'Node Details',
  //   component: ValidatorDetails,
  // },
  {
    path: '/address/:hash',
    title: 'Address Details',
    component: Transactions,
  },
  {
    path: '/address/:hash/page/:page',
    title: 'Address Details',
    component: Transactions,
  },
  {
    path: '/transactions/:hash',
    title: 'Transaction Details',
    component: TransactionDetails,
  },
  {
    path: '/blocks/page/:page',
    title: 'Blocks',
    component: Blocks,
  },
  {
    path: '/blocks/page/last',
    title: 'Block Details',
    component: BlockDetails,
  },
  {
    path: '/blocks',
    title: 'Blocks',
    component: Blocks,
  },
  {
    path: '/blocks/:hash',
    title: 'Block Details',
    component: BlockDetails,
  },
  {
    path: '/miniblocks/:hash',
    title: 'Miniblock Details',
    component: MiniBlockDetails,
  },
  {
    path: '/miniblocks/:hash/page/:page',
    title: 'Miniblock Details',
    component: MiniBlockDetails,
  },
  {
    path: '/blocks/shards/:shard/page/:page',
    title: 'Shard Details',
    component: Blocks,
  },
  {
    path: '/blocks/shards/:shard',
    title: 'Shard Details',
    component: Blocks,
  },
  {
    path: '/blocks/epoch/:epoch/page/:page',
    title: 'Epoch Details',
    component: Blocks,
  },
  {
    path: '/blocks/epoch/:epoch',
    title: 'Epoch Details',
    component: Blocks,
  },
  {
    path: '/transactions/shard-to/:shard/page/:page',
    title: 'Shard Details',
    component: Transactions,
  },
  {
    path: '/transactions/shard-to/:shard',
    title: 'Shard Details',
    component: Transactions,
  },
  {
    path: '/transactions/shard-from/:shard/page/:page',
    title: 'Shard Details',
    component: Transactions,
  },
  {
    path: '/transactions/shard-from/:shard',
    title: 'Shard Details',
    component: Transactions,
  },
  {
    path: '/search/:query',
    title: 'Search',
    component: EmptySearch,
  },
  {
    path: '/search/',
    title: 'Search',
    component: EmptySearch,
  },
  {
    path: '/',
    title: '',
    component: Home,
  },
];

const wrappedRoutes = () =>
  routes.map((route) => {
    const title = route.title ? `${route.title} • Elrond Explorer` : 'Elrond Explorer';
    return {
      path: route.path,
      component: (withPageTitle(
        title,
        withNetworkReady(route.component)
      ) as any) as React.ComponentClass<{}, any>,
    };
  });

export default wrappedRoutes();
