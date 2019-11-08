import React from 'react';
import Home from './components/Home';
import Transactions from './components/Transactions';
import Blocks from './components/Blocks';
import TransactionDetails from './components/TransactionDetails';
import BlockDetails from './components/BlockDetails';
import EmptySearch from './components/EmptySearch';
import { withTestnetReady, withPageTitle } from './sharedComponents';

// TODO: daca hashul nu e valid (functie validare) return 404 (page not found)

type RouteType = {
  path: string;
  title: string;
  component: React.ComponentType;
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
    path: '/address/:hash',
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
    path: '/shards/:shard/page/:page',
    title: 'Shard Details',
    component: Blocks,
  },
  {
    path: '/search/:query',
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
  routes.map(route => {
    const title = route.title ? `${route.title} • Elrond Explorer` : 'Elrond Explorer';
    return {
      path: route.path,
      component: withPageTitle(title, withTestnetReady(route.component)),
    };
  });

export default wrappedRoutes();
