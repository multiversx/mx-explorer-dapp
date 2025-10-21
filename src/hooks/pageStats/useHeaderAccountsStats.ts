import { useEffect } from 'react';
import BigNumber from 'bignumber.js';
import { useDispatch, useSelector } from 'react-redux';

import { useAdapter, useHasGrowthWidgets } from 'hooks';
import {
  pageHeadersAccountsStatsSelector,
  statsSelector
} from 'redux/selectors';
import {
  setPageHeaderAccountsStats,
  setPageHeaderAccountStatsTotalAccounts
} from 'redux/slices';
import { HeadersAccountsType } from 'types/headerStats.types';

export const useHeaderAccountsStats = () => {
  const headersAccounts = useSelector(pageHeadersAccountsStatsSelector);
  const { unprocessed: unprocessedStats } = useSelector(statsSelector);

  const hasGrowthWidgets = useHasGrowthWidgets();
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
    if (hasGrowthWidgets) {
      getHeadersAccounts();
    }
  }, [hasGrowthWidgets]);

  useEffect(() => {
    if (unprocessedStats.accounts === 0) {
      return;
    }

    dispatch(
      setPageHeaderAccountStatsTotalAccounts(
        new BigNumber(unprocessedStats.accounts).toFormat(0)
      )
    );
  }, [unprocessedStats.accounts, headersAccounts]);

  return {
    title: 'Accounts',
    headersAccounts
  };
};
