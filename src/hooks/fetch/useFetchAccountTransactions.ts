import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { MAX_RESULTS } from 'appConstants';
import { useAdapter } from 'hooks';
import {
  accountExtraSelector,
  accountSelector,
  activeNetworkSelector
} from 'redux/selectors';
import { setAccountExtraTransactions } from 'redux/slices';

export const useFetchAccountTransactions = () => {
  const dispatch = useDispatch();
  const { account } = useSelector(accountSelector);
  const { address, txCount } = account;
  const { accountExtra } = useSelector(accountExtraSelector);
  const { address: extraAddress, accountTransactions } = accountExtra;

  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const { getAccountTransactions } = useAdapter();

  const fetchAccountTransactionsDetails = () => {
    dispatch(
      setAccountExtraTransactions({
        accountTransactions: [],
        accountTransactionsFetched: undefined
      })
    );
    getAccountTransactions({
      address,
      size: MAX_RESULTS,
      fields: [
        'sender',
        'receiver',
        'timestamp',
        'timestampMs',
        'senderAssets',
        'receiverAssets',
        'fee'
      ].join(',')
    }).then(({ data, success }) => {
      dispatch(
        setAccountExtraTransactions({
          accountTransactions: data ?? [],
          accountTransactionsFetched: success
        })
      );
    });
  };

  useEffect(() => {
    const isExtraAccountReady = address && address === extraAddress;

    if (
      !isExtraAccountReady ||
      accountTransactions.length > 0 ||
      txCount === 0
    ) {
      return;
    }

    fetchAccountTransactionsDetails();
  }, [activeNetworkId, address, extraAddress, txCount]);
};
