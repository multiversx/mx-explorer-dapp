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
    lazyComponent: () =>
      import('pages/Transactions').then((module) => module.Transactions)
  },
  {
    path: transactionsRoutes.transactionDetails,
    title: 'Transaction Details',
    lazyComponent: () =>
      import('pages/TransactionDetails').then(
        (module) => module.TransactionDetails
      )
  },
  {
    path: transactionsInPoolRoutes.transactionsInPool,
    title: 'Transactions In Pool',
    lazyComponent: () =>
      import('pages/TransactionsInPool').then(
        (module) => module.TransactionsInPool
      )
  },
  {
    path: transactionsInPoolRoutes.transactionsInPoolDetails,
    title: 'Transaction In Pool Details',
    lazyComponent: () =>
      import('pages/TransactionInPoolDetails').then(
        (module) => module.TransactionInPoolDetails
      )
  }
];
