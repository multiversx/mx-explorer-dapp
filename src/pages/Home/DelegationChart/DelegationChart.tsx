import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Area, Tooltip, ResponsiveContainer, AreaChart } from 'recharts';
import { SingleValue } from 'react-select';

import { useFetchGrowthStaking } from 'hooks';
import { growthStakingSelector } from 'redux/selectors';

import { DropdownChart } from '../DropdownChart';

import { StakingStatisticsLabelEnum } from './enum';

import type { DropdownChartOptionType } from '../DropdownChart/types';
import type { StatisticType } from './types';

import styles from './styles.module.scss';

const CustomTooltip = (props: any) => {
  const { payload, active } = props;

  if (!payload || !active) {
    return null;
  }

  return (
    <div className={styles.tooltip}>
      {payload.map((item: any) => (
        <div key={item.value}>
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
            minimumFractionDigits: 0
          }).format(item.value)}
        </div>
      ))}
    </div>
  );
};

export const DelegationChart = () => {
  const {
    stakingPercentage,
    totalStaked,
    averageAPR,
    circulatingSupply,
    // totalStaked7d,
    usersStaking,
    totalStaked30d,
    totalStakedAll
  } = useSelector(growthStakingSelector);

  const filters: DropdownChartOptionType[] = [
    // {
    //   label: StakingSelectLabelEnum.Days7,
    //   value: StakingSelectValueEnum.totalStaked7d
    // },x
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
    // [StakingSelectValueEnum.totalStaked7d, totalStaked7d],
    ['totalStaked30d', totalStaked30d],
    ['totalStakedAll', totalStakedAll]
  ]);

  const [data, setData] = useState(dataMap.get('totalStaked30d'));
  const teal = getComputedStyle(document.documentElement)
    .getPropertyValue('--teal')
    .trim();

  const onChange = (option: SingleValue<DropdownChartOptionType>) => {
    if (option && option.value) {
      setData(dataMap.get(option.value));
    }
  };

  useFetchGrowthStaking();

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
          <DropdownChart
            options={filters}
            defaultValue={filters[0]}
            onChange={onChange}
          />
        </div>
      </div>

      <ResponsiveContainer
        height={75}
        width='100%'
        className={styles.container}
      >
        <AreaChart data={data} margin={{ left: 0, right: 0 }}>
          <defs>
            <linearGradient id='delegationGradient' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor={teal} stopOpacity={0.15} />
              <stop offset='95%' stopColor={teal} stopOpacity={0} />
            </linearGradient>
          </defs>

          <Area
            type='monotone'
            dataKey='value'
            stroke={teal}
            fill='url(#delegationGradient)'
          />

          <Tooltip content={CustomTooltip} />
        </AreaChart>
      </ResponsiveContainer>

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
