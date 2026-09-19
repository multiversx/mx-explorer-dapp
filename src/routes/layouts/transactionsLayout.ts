import { TransactionDetails } from 'pages/TransactionDetails';
import { TransactionInPoolDetails } from 'pages/TransactionInPoolDetails';
import { Transactions } from 'pages/Transactions';
import { TransactionsInPool } from 'pages/TransactionsInPool';

import { TitledRouteObject } from '../routes';

export const transactionsInPoolRoutes = {
  transactionsInPool: '/transactions/pool',
  transactionsInPoolDetails: '/transactions/pool/:hash'
};

export const transactionsRoutes = {
  transactions: '/transactions',
  transactionDetails: '/transactions/:hash/*',
  transactionDetailsLogs: '/transactions/:hash/logs',
  transactionDetailsInnerTransactions: '/transactions/:hash/inner-transactions'
};

export const transactionsLayout: TitledRouteObject[] = [
  {
    path: transactionsRoutes.transactions,
    title: 'Transactions',
    Component: Transactions
  },
  {
    path: transactionsRoutes.transactionDetails,
    title: 'Transaction Details',
    Component: TransactionDetails
  },
  {
    path: transactionsInPoolRoutes.transactionsInPool,
    title: 'Transactions In Pool',
    Component: TransactionsInPool
  },
  {
    path: transactionsInPoolRoutes.transactionsInPoolDetails,
    title: 'Transaction In Pool Details',
    Component: TransactionInPoolDetails
  }
];
