import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { getAccountTopNeighbors, isContract } from 'helpers';
import { useFetchAccountTransactions } from 'hooks';
import { accountExtraSelector, accountSelector } from 'redux/selectors';

export const useGetTransactionNeighbors = () => {
  const { account } = useSelector(accountSelector);
  const { accountExtra } = useSelector(accountExtraSelector);
  const { address } = account;
  const { accountTransactions } = accountExtra;

  useFetchAccountTransactions();

  const neighbours = useMemo(() => {
    const filteredTransactions = accountTransactions.filter(
      (transaction) => !isContract(transaction.receiver)
    );
    return getAccountTopNeighbors({
      transactions: filteredTransactions,
      target: address
    });
  }, [accountTransactions, address]);

  return neighbours;
};
