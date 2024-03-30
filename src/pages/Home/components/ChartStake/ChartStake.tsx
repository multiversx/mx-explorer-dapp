import { useCallback, useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { SingleValue } from 'react-select';

import { Select, SelectOptionType } from 'components';
import { useFetchGrowthStaking } from 'hooks';
import { growthStakingSelector, activeNetworkSelector } from 'redux/selectors';
import {
  StatisticType,
  StakingStatisticsLabelEnum,
  WithClassnameType
} from 'types';

import styles from './styles.module.scss';
import { ChartRoot } from '../ChartRoot';

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
  const primary = getComputedStyle(document.documentElement)
    .getPropertyValue('--primary')
    .trim();

  const defaultValue = filters.find((filter) => filter.value === initialFilter);
  const [data, setData] = useState(dataMap.get(initialFilter));

  const onChange = useCallback(
    (option: SingleValue<SelectOptionType>) => {
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
    <div className={classNames(styles.chart, className)}>
      <div className={styles.wrapper}>
        <div className={styles.left}>
          <div className={styles.label}>Total Staked</div>
          <div className={styles.price}>
            {totalStaked} EGLD <span>({stakingPercentage})</span>
          </div>
        </div>

        <div className={styles.right}>
          <Select
            options={filters}
            onChange={onChange}
            defaultValue={defaultValue}
          />
        </div>
      </div>

      <div className={styles.root}>
        <ChartRoot
          className={styles.container}
          data={data}
          height={75}
          color={primary}
          identifier='delegationGradient'
          tooltipFormatter={(option: any) =>
            `${new BigNumber(option.value).toFormat(0)} ${egldLabel}`
          }
        />
      </div>

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
