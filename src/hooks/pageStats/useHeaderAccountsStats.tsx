import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  pageHeadersAccountsSelector,
  pageHeadersStatsSelector
} from 'redux/selectors/pageHeadersStats';
import { setPageHeaderStats } from 'redux/slices/pageHeadersStats';
import { useAdapter } from '../../components';

export const useHeaderAccountsStats = () => {
  const pageHeaders = useSelector(pageHeadersStatsSelector);
  const headersAccounts = useSelector(pageHeadersAccountsSelector);

  const dispatch = useDispatch();
  const { getGrowthHeaders } = useAdapter();

  const getHeadersAccounts = async () => {
    // if (headersAccounts != null) {
    //   return headersAccounts;
    // }

    const result = await getGrowthHeaders('/accounts');

    if (!result.success) {
      // dispatch(setPageHeaderStats(pageHeaders));
      return pageHeaders?.accounts;
    }

    dispatch(
      setPageHeaderStats({
        ...pageHeaders,
        accounts: result.data
      })
    );
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
