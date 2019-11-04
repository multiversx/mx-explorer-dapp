import React from 'react';
import Home from './components/Home';
import Transactions from './components/Transactions';
import Blocks from './components/Blocks';
import TransactionDetails from './components/TransactionDetails';
import BlockDetails from './components/BlockDetails';
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

const routes = [
  {
    path: '/transactions/page/:page',
    component: withTestnetReady(Transactions),
  },
  {
    path: '/transactions/:transactionId',
    component: withTestnetReady(TransactionDetails),
  },
  {
    path: '/blocks/page/:page',
    component: withTestnetReady(Blocks),
  },
  {
    path: '/blocks/:blockId',
    component: withTestnetReady(BlockDetails),
  },
  {
    path: '/',
    component: withTestnetReady(Home),
  },
];

export default routes;
