import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { SingleValue } from 'react-select';

import { useFetchGrowthStaking } from 'hooks';
import { growthStakingSelector } from 'redux/selectors';

import { ChartSelect } from '../ChartSelect';
import { ChartRoot } from '../ChartRoot';

import { StakingStatisticsLabelEnum } from './enum';

import type { ChartSelectOptionType } from '../ChartSelect/types';
import type { StatisticType } from './types';

import styles from './styles.module.scss';

export const ChartStake = () => {
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

  const filters: ChartSelectOptionType[] = [
    {
      label: '7d',
      value: 'totalStaked7d'
    },
    {
      label: '30d',
      value: 'totalStaked30d'
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

  const dataMap = new Map([
    ['totalStaked7d', totalStaked7d],
    ['totalStaked30d', totalStaked30d],
    ['totalStakedAll', totalStakedAll]
  ]);

  const initialFilter = 'totalStaked7d';
  const teal = getComputedStyle(document.documentElement)
    .getPropertyValue('--teal')
    .trim();

  const [data, setData] = useState(dataMap.get(initialFilter));

  const onChange = useCallback(
    (option: SingleValue<ChartSelectOptionType>) => {
      if (option && option.value && isFetched) {
        setData(dataMap.get(option.value));
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
    <div className={styles.chart}>
      <div className={styles.wrapper}>
        <div className={styles.left}>
          <div className={styles.label}>Total Staked</div>
          <div className={styles.price}>
            {totalStaked} EGLD <span>({stakingPercentage})</span>
          </div>
        </div>

        <div className={styles.right}>
          <ChartSelect options={filters} onChange={onChange} />
        </div>
      </div>

      <ChartRoot
        className={styles.container}
        data={data}
        color={teal}
        identifier='delegationGradient'
        tooltipFormatter={(option: any) =>
          new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
            minimumFractionDigits: 0
          }).format(option.value)
        }
      />

      <div className={styles.statistics}>
        {statistics.map((statistic) => (
          <div className={styles.statistic} key={statistic.label}>
            <div className={styles.label}>{statistic.label}</div>
            <div className={styles.value}>{statistic.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};