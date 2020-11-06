import React from 'react';
import BlockDetails from './components/BlockDetails';
import Blocks from './components/Blocks';
import EmptySearch from './components/EmptySearch';
import Home from './components/Home';
import MiniBlockDetails from './components/MiniBlockDetails';
import TransactionDetails from './components/TransactionDetails';
import Transactions from './components/Transactions';
import Address from './components/Address';
import Nodes from './components/Nodes';
import Identities from './components/Identities';
import IdentityDetails from './components/IdentityDetails';
import ValidatorsTable from './components/Validators/ValidatorsTable';
import BrandDetails from './components/Validators/BrandDetails';
import ValidatorDetails from './components/Validators/ValidatorDetails';
import NodeDetails from './components/NodeDetails';
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
  // index: '/validators',
  index: '/identities',
  // brandDetails: `/validators/:identity`,
  // nodes: '/validators/nodes',
  nodes: '/nodes',
  nodeDetails: '/nodes/:publicKey',
  // validatorDetails: '/validators/nodes/:hash',
  identityDetails: '/validators/:id',
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
    path: validatorsRoutes.nodes,
    title: 'Nodes',
    component: Nodes,
  },
  {
    path: validatorsRoutes.index,
    title: 'Validators',
    component: Identities,
  },
  {
    path: validatorsRoutes.identityDetails,
    title: 'Validators',
    component: IdentityDetails,
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
  {
    path: validatorsRoutes.nodeDetails,
    title: 'Node Details',
    component: NodeDetails,
  },
  // {
  //   path: validatorsRoutes.validatorDetails,
  //   title: 'Node Details',
  //   component: ValidatorDetails,
  // },
  {
    path: '/address/:hash',
    title: 'Address Details',
    component: Address,
  },
  {
    path: '/address/:hash/page/:page',
    title: 'Address Details',
    component: Address,
  },
  {
    path: '/transactions/:hash',
    title: 'Transaction Details',
    component: TransactionDetails,
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
