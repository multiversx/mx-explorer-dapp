import React from 'react';
import Home from './components/Home';
import Transactions from './components/Transactions';
import Blocks from './components/Blocks';
import TransactionDetails from './components/TransactionDetails';
import BlockDetails from './components/BlockDetails';
import EmptySearch from './components/EmptySearch';
import { TestnetReady } from './sharedComponents';

const withTestnetReady = (Component: React.ComponentType) =>
  class WithTestnetReady extends React.Component {
    render() {
      return (
        <TestnetReady>
          <Component />
        </TestnetReady>
      );
    }
  };

// TODO: daca hashul nu e valid (functie validare) return 404 (page not found)

const routes = [
  {
    path: '/transactions/page/:page',
    component: withTestnetReady(Transactions),
  },
  {
    path: '/address/:hash',
    component: withTestnetReady(Transactions),
  },
  {
    path: '/transactions/:hash',
    component: withTestnetReady(TransactionDetails),
  },
  {
    path: '/blocks/page/:page',
    component: withTestnetReady(Blocks),
  },
  {
    path: '/blocks/:hash',
    component: withTestnetReady(BlockDetails),
  },
  {
    path: '/shards/:shard/page/:page',
    component: withTestnetReady(Blocks),
  },
  {
    path: '/search/:query',
    component: withTestnetReady(EmptySearch),
  },
  {
    path: '/',
    component: withTestnetReady(Home),
  },
];

export default routes;
