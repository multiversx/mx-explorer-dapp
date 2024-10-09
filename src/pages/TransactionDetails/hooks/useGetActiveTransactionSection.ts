import { useMatch } from 'react-router-dom';
import { useNetworkRoute } from 'hooks';
import { transactionsRoutes } from 'routes';
import { TransactionInfoTabsEnum } from 'types';

export const useGetActiveTransactionSection = () => {
  const networkRoute = useNetworkRoute();
  const isLogsRoute = useMatch(
    networkRoute(transactionsRoutes.transactionDetailsLogs)
  );
  const isInnerTransactionRoute = useMatch(
    networkRoute(transactionsRoutes.transactionDetailsInnerTransactions)
  );

  if (Boolean(isLogsRoute)) {
    return TransactionInfoTabsEnum.logs;
  }
  if (Boolean(isInnerTransactionRoute)) {
    return TransactionInfoTabsEnum.innerTransactions;
  }

  return TransactionInfoTabsEnum.details;
};
