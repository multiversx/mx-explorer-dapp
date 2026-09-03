import { useEffect } from 'react';
import BigNumber from 'bignumber.js';
import { useDispatch, useSelector } from 'react-redux';

import { useAdapter, useHasGrowthWidgets } from 'hooks';
import {
  pageHeadersAccountsStatsSelector,
  statsAccountsSelector
} from 'redux/selectors';
import {
  setPageHeaderAccountsStats,
  setPageHeaderAccountStatsTotalAccounts
} from 'redux/slices';
import { HeadersAccountsType } from 'types/headerStats.types';

import { PageStatsOptionsType } from './types';

export const useHeaderAccountsStats = ({
  isEnabled = true
}: PageStatsOptionsType = {}) => {
  const headersAccounts = useSelector(pageHeadersAccountsStatsSelector);
  const statsAccounts = useSelector(statsAccountsSelector);

  const hasGrowthWidgets = useHasGrowthWidgets();
  const dispatch = useDispatch();
  const { getGrowthHeaders } = useAdapter();

  const getHeadersAccounts = async () => {
    if (headersAccounts.usersStaking !== undefined) {
      return headersAccounts;
    }

    const result = await getGrowthHeaders('/accounts');

    if (!result.success) {
      return {} as HeadersAccountsType;
    }

    dispatch(
      setPageHeaderAccountsStats({
        activeAccountsToday: new BigNumber(
          result.data.activeAccountsToday
        ).toFormat(0),
        totalAccounts: new BigNumber(result.data.totalAccounts).toFormat(0),
        usersStaking: new BigNumber(result.data.usersStaking).toFormat(0)
        // newAccountsToday: new BigNumber(result.data.newAccountsToday).toFormat(
        //   0
        // )
      })
    );
    return result.data;
  };

  useEffect(() => {
    if (hasGrowthWidgets && isEnabled) {
      getHeadersAccounts();
    }
  }, [hasGrowthWidgets, isEnabled]);

  useEffect(() => {
    if (!isEnabled || statsAccounts === 0) {
      return;
    }

    dispatch(
      setPageHeaderAccountStatsTotalAccounts(
        new BigNumber(statsAccounts).toFormat(0)
      )
    );
  }, [statsAccounts, isEnabled, dispatch]);

  return {
    title: 'Accounts',
    headersAccounts
  };
};
