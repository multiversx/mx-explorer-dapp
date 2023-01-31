import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAdapter } from '../../components';
import { pageHeadersAccountsStatsSelector } from '../../redux/selectors/pageHeadersAccountsStats';
import { setPageHeaderAccountsStats } from '../../redux/slices/pageHeadersAccountsStats';
import { HeadersAccountsType } from '../../types/headerStats.types';

export const useHeaderAccountsStats = () => {
  const headersAccounts = useSelector(pageHeadersAccountsStatsSelector);

  const dispatch = useDispatch();
  const { getGrowthHeaders } = useAdapter();

  const getHeadersAccounts = async () => {
    if (Object.keys(headersAccounts).length !== 0) {
      return headersAccounts;
    }

    const result = await getGrowthHeaders('/accounts');

    if (!result.success) {
      return {} as HeadersAccountsType;
    }

    dispatch(setPageHeaderAccountsStats(result.data));
    return result.data;
  };

  useEffect(() => {
    getHeadersAccounts();
  }, []);

  return {
    title: 'Accounts',
    headersAccounts
  };
};
