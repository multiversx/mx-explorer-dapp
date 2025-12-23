import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import {
  getAccountTopNeighbors,
  getDisplayReceiver,
  isContract
} from 'helpers';
import { useFetchAccountTransactions } from 'hooks';
import { accountExtraSelector, accountSelector } from 'redux/selectors';

export const useGetApplicationActivity = () => {
  const { account } = useSelector(accountSelector);
  const { accountExtra } = useSelector(accountExtraSelector);
  const { address } = account;
  const { accountTransactions } = accountExtra;

  useFetchAccountTransactions();

  const applicationActivity = useMemo(() => {
    const filteredTransactions = accountTransactions.filter((transaction) =>
      isContract(getDisplayReceiver(transaction).receiver)
    );

    return getAccountTopNeighbors({
      transactions: filteredTransactions,
      target: address
    });
  }, [accountTransactions, address]);

  return applicationActivity;
};
