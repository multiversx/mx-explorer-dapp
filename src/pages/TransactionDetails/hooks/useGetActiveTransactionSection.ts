import { useMatch } from 'react-router-dom';
import { useNetworkRoute } from 'hooks';
import { transactionsRoutes } from 'routes';
import { TransactionInfoTabsEnum } from 'types';

export const useGetActiveTransactionSection = () => {
  const networkRoute = useNetworkRoute();
  const isLogsRoute: any = useMatch(
    networkRoute(transactionsRoutes.transactionDetailsLogs)
  );
  const isInnerTransactionRoute: any = useMatch(
    networkRoute(transactionsRoutes.transactionDetailsInnerTransactions)
  );

  if (isLogsRoute) {
    return TransactionInfoTabsEnum.logs;
  }
  if (isInnerTransactionRoute) {
    return TransactionInfoTabsEnum.innerTransactions;
  }

  return TransactionInfoTabsEnum.details;
};
