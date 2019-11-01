import Home from './components/Home';
import Transactions from './components/Transactions';
import Blocks from './components/Blocks';
import TransactionDetails from './components/TransactionDetails';
import BlockDetails from './components/BlockDetails';

const routes = [
  {
    path: '/transactions/page/:page',
    component: Transactions,
  },
  {
    path: '/transactions/:transactionId',
    component: TransactionDetails,
  },
  {
    path: '/blocks/page/:page',
    component: Blocks,
  },
  {
    path: '/blocks/:transactionId',
    component: BlockDetails,
  },
  {
    path: '/',
    component: Home,
  },
];

export default routes;
