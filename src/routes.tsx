import React from 'react';
import BlockDetails from './components/BlockDetails';
import Blocks from './components/Blocks';
import EmptySearch from './components/EmptySearch';
import Home from './components/Home';
import MiniBlockDetails from './components/MiniBlockDetails';
import TransactionDetails from './components/TransactionDetails';
import Transactions from './components/Transactions';
import AccountDetails from './components/AccountDetails';
import Accounts from './components/Accounts';
import Nodes from './components/Nodes';
import Identities from './components/Identities';
import IdentityDetails from './components/IdentityDetails';
import NodeDetails from './components/NodeDetails';
import Tokens from './components/Tokens';
import TokenDetails from './components/TokenDetails';
import { withPageTitle, withNetworkReady } from './sharedComponents';
import Providers from 'components/Providers';
import ProviderDetails from 'components/ProviderDetails';

interface RouteType {
  path: string;
  title: string;
  component: any;
}

// INFO: to split the app in chunks use:
// component: React.lazy(() => import('./components/Validators')),

export const validatorsRoutes = {
  index: '/validators',
  nodes: '/nodes',
  providers: '/providers',
  nodeDetails: '/nodes/:publicKey',
  identityDetails: '/identities/:id',
  providerDetails: '/providers/:hash',
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
    path: '/accounts',
    title: 'Accounts',
    component: Accounts,
  },
  {
    path: '/accounts/:hash',
    title: 'Account Details',
    component: AccountDetails,
  },
  {
    path: '/address/:hash',
    title: 'Account Details',
    component: AccountDetails, // redirect
  },
  {
    path: '/miniblocks/:hash',
    title: 'Miniblock Details',
    component: MiniBlockDetails,
  },
  {
    path: '/tokens',
    title: 'Tokens',
    component: Tokens,
  },
  {
    path: '/tokens/:hash',
    title: 'Token Details',
    component: TokenDetails,
  },
  {
    path: '/providers',
    title: 'Providers',
    component: Providers,
  },
  {
    path: '/providers/:hash',
    title: 'Provider Details',
    component: ProviderDetails,
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
