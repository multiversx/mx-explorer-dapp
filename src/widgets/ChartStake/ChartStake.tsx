import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { SingleValue } from 'react-select';

import { SelectOptionType } from 'components';
import { getPrimaryColor } from 'helpers';
import { useFetchGrowthStaking } from 'hooks';
import { growthStakingSelector, egldLabelSelector } from 'redux/selectors';
import {
  StatisticType,
  StakingStatisticsLabelEnum,
  WithClassnameType
} from 'types';

import { ChartCard, ChartRoot } from '../ChartCard';

const FILTERS: SelectOptionType[] = [
  { label: '7d', value: 'totalStaked7d' },
  { label: '30d', value: 'totalStaked30d' },
  { label: '365d', value: 'totalStaked365d' },
  { label: 'All', value: 'totalStakedAll' }
];

const INITIAL_FILTER = 'totalStaked30d';
const DEFAULT_FILTER_VALUE = FILTERS.find(
  (filter) => filter.value === INITIAL_FILTER
);

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
    isDataReady
  } = useSelector(growthStakingSelector);
  const egldLabel = useSelector(egldLabelSelector);

  const statistics: StatisticType[] = useMemo(
    () => [
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
    ],
    [circulatingSupply, usersStaking, averageAPR]
  );

  const dataMap = useMemo(() => {
    const totalStaked365d = totalStakedAll.slice(
      totalStakedAll.length - 365,
      totalStakedAll.length
    );

    return new Map([
      ['totalStaked7d', totalStaked7d],
      ['totalStaked30d', totalStaked30d],
      ['totalStaked365d', totalStaked365d],
      ['totalStakedAll', totalStakedAll]
    ]);
  }, [totalStaked7d, totalStaked30d, totalStakedAll]);

  const dataMapRef = useRef(dataMap);
  dataMapRef.current = dataMap;

  const primary = useMemo(() => getPrimaryColor(), []);

  const [data, setData] = useState(() => dataMap.get(INITIAL_FILTER));

  const handleChange = useCallback(
    (option: SingleValue<SelectOptionType>) => {
      if (option && option.value && isDataReady) {
        setData(dataMapRef.current.get(String(option.value)));
      }
    },
    [isDataReady]
  );

  const onInitialLoad = useCallback(() => {
    if (isDataReady) {
      setData(dataMapRef.current.get(INITIAL_FILTER));
    }
  }, [isDataReady]);

  const tooltipFormatter = useCallback(
    (option: any) => `${new BigNumber(option.value).toFormat(0)} ${egldLabel}`,
    [egldLabel]
  );

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
      filters={FILTERS}
      defaultFilterValue={DEFAULT_FILTER_VALUE}
      onChange={handleChange}
      className={classNames('chart-stake', className)}
      statistics={statistics}
    >
      <ChartRoot
        data={data}
        height={75}
        color={primary}
        identifier='delegationGradient'
        tooltipFormatter={tooltipFormatter}
      />
    </ChartCard>
  );
};
