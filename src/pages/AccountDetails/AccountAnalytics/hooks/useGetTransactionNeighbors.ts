import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import {
  getAccountTopNeighbors,
  getDisplayReceiver,
  isContract
} from 'helpers';
import { useFetchAccountTransactions } from 'hooks';
import { accountExtraSelector, accountSelector } from 'redux/selectors';
import { ChartResolutionRangeType } from 'types';

export const useGetTransactionNeighbors = ({
  range,
  filterApps = true
}: {
  range: ChartResolutionRangeType;
  filterApps?: boolean;
}) => {
  const { account } = useSelector(accountSelector);
  const { accountExtra } = useSelector(accountExtraSelector);
  const { address } = account;
  const { accountTransactions } = accountExtra;

  useFetchAccountTransactions();

  const neighbours = useMemo(() => {
    if (filterApps) {
      const filteredTransactions = accountTransactions.filter(
        (transaction) => !isContract(getDisplayReceiver(transaction).receiver)
      );

      return getAccountTopNeighbors({
        transactions: filteredTransactions,
        target: address,
        range
      });
    }

    return getAccountTopNeighbors({
      transactions: accountTransactions,
      target: address,
      range
    });
  }, [accountTransactions, address, range, filterApps]);

  return neighbours;
};
