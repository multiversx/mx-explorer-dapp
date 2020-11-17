import React from 'react';
import BlockDetails from './components/BlockDetails';
import Blocks from './components/Blocks';
import EmptySearch from './components/EmptySearch';
import Home from './components/Home';
import MiniBlockDetails from './components/MiniBlockDetails';
import TransactionDetails from './components/TransactionDetails';
import Transactions from './components/Transactions';
import AddressDetails from './components/AddressDetails';
import Addresses from './components/Addresses';
import Nodes from './components/Nodes';
import Identities from './components/Identities';
import IdentityDetails from './components/IdentityDetails';
import NodeDetails from './components/NodeDetails';
import { withPageTitle, withNetworkReady } from './sharedComponents';

interface RouteType {
  path: string;
  title: string;
  component: any;
}

// INFO: to split the app in chunks use:
// component: React.lazy(() => import('./components/Validators')),

export const validatorsRoutes = {
  index: '/identities',
  nodes: '/nodes',
  nodeDetails: '/nodes/:publicKey',
  identityDetails: '/validators/:id',
};

const routes: RouteType[] = [
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
    path: '/transactions',
    title: 'Transactions',
    component: Transactions,
  },
  {
    path: '/transactions/:hash',
    title: 'Transaction Details',
    component: TransactionDetails,
  },
  {
    path: validatorsRoutes.index,
    title: 'Validators',
    component: Identities,
  },
  {
    path: validatorsRoutes.identityDetails,
    title: 'Validator Details',
    component: IdentityDetails,
  },
  {
    path: validatorsRoutes.nodes,
    title: 'Nodes',
    component: Nodes,
  },
  {
    path: validatorsRoutes.nodeDetails,
    title: 'Node Details',
    component: NodeDetails,
  },
  {
    path: '/addresses',
    title: 'Addresses',
    component: Addresses,
  },
  {
    path: '/addresses/:hash',
    title: 'Address Details',
    component: AddressDetails,
  },
  {
    path: '/miniblocks/:hash',
    title: 'Miniblock Details',
    component: MiniBlockDetails,
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
