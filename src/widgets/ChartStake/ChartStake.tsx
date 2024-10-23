import { useCallback, useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { SingleValue } from 'react-select';

import { SelectOptionType } from 'components';
import { getPrimaryColor } from 'helpers';
import { useFetchGrowthStaking } from 'hooks';
import { growthStakingSelector, activeNetworkSelector } from 'redux/selectors';
import {
  StatisticType,
  StakingStatisticsLabelEnum,
  WithClassnameType
} from 'types';

import { ChartCard, ChartRoot } from '../ChartCard';

export const ChartStake = ({ className }: WithClassnameType) => {
  const {
    stakingPercentage,
    totalStaked,
    averageAPR,
    circulatingSupply,
    usersStaking,
    totalStaked7d,
    totalStaked30d,
    totalStakedAll,
    isFetched
  } = useSelector(growthStakingSelector);
  const { egldLabel } = useSelector(activeNetworkSelector);

  const filters: SelectOptionType[] = [
    {
      label: '7d',
      value: 'totalStaked7d'
    },
    {
      label: '30d',
      value: 'totalStaked30d'
    },
    {
      label: '365d',
      value: 'totalStaked365d'
    },
    {
      label: 'All',
      value: 'totalStakedAll'
    }
  ];

  const statistics: StatisticType[] = [
    {
      label: StakingStatisticsLabelEnum.CirculatingSupply,
      value: circulatingSupply
    },
    {
      label: StakingStatisticsLabelEnum.UsersStaking,
      value: usersStaking
    },
    {
      label: StakingStatisticsLabelEnum.AverageAPR,
      value: averageAPR
    }
  ];

  const totalStaked365d = totalStakedAll.slice(
    totalStakedAll.length - 365,
    totalStakedAll.length
  );

  const dataMap = new Map([
    ['totalStaked7d', totalStaked7d],
    ['totalStaked30d', totalStaked30d],
    ['totalStaked365d', totalStaked365d],
    ['totalStakedAll', totalStakedAll]
  ]);

  const initialFilter = 'totalStaked30d';
  const primary = getPrimaryColor();

  const defaultValue = filters.find((filter) => filter.value === initialFilter);
  const [data, setData] = useState(dataMap.get(initialFilter));

  const handleChange = useCallback(
    (option: SingleValue<SelectOptionType>) => {
      if (option && option.value && isFetched) {
        setData(dataMap.get(String(option.value)));
      }
    },
    [isFetched]
  );

  const onInitialLoad = useCallback(() => {
    if (isFetched) {
      setData(dataMap.get(initialFilter));
    }
  }, [isFetched]);

  useFetchGrowthStaking();
  useEffect(onInitialLoad, [onInitialLoad]);

  return (
    <ChartCard
      title='Total Staked'
      value={
        <>
          {totalStaked} {egldLabel} <span>({stakingPercentage})</span>
        </>
      }
      filters={filters}
      defaultFilterValue={defaultValue}
      onChange={handleChange}
      className={classNames('chart-stake', className)}
      statistics={statistics}
    >
      <ChartRoot
        data={data}
        height={75}
        color={primary}
        identifier='delegationGradient'
        tooltipFormatter={(option: any) =>
          `${new BigNumber(option.value).toFormat(0)} ${egldLabel}`
        }
      />
    </ChartCard>
  );
};
