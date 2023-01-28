import React, { useCallback, useEffect, useState } from 'react';
import {
  faCircleUp,
  faCircleDown,
  faCircleMinus
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';
import { SingleValue } from 'react-select';
import {
  Area,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  TooltipProps
} from 'recharts';
import classNames from 'classnames';

import { useFetchGrowthPrice } from 'hooks';
import { growthPriceSelector } from 'redux/selectors';

import { TrendEnum } from 'types';

import { PriceStatisticsLabelEnum } from './enum';
import { DropdownChart } from '../DropdownChart';

import type { StatisticType } from './types';
import type { DropdownChartOptionType } from '../DropdownChart/types';

import styles from './styles.module.scss';

const CustomTooltip = (props: TooltipProps<number, string>) => {
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
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
          }).format(item.value)}
        </div>
      ))}
    </div>
  );
};

export const PriceChart = () => {
  const {
    currentPrice,
    volume24h,
    marketCap,
    priceChangeTrend,
    priceChange24h,
    price7d,
    price30d,
    priceAll,
    isFetched
  } = useSelector(growthPriceSelector);

  const filters: DropdownChartOptionType[] = [
    {
      label: '7d',
      value: 'price7d'
    },
    {
      label: '30d',
      value: 'price30d'
    },
    {
      label: 'All',
      value: 'priceAll'
    }
  ];

  const statistics: StatisticType[] = [
    { label: PriceStatisticsLabelEnum.MarketCap, value: marketCap },
    { label: PriceStatisticsLabelEnum.Volume24h, value: volume24h }
  ];

  const dataMap = new Map([
    ['price7d', price7d],
    ['price30d', price30d],
    ['priceAll', priceAll]
  ]);

  const trendIcon = new Map([
    [TrendEnum.up, faCircleUp],
    [TrendEnum.down, faCircleDown],
    [TrendEnum.neutral, faCircleMinus]
  ]);

  const initialFilter = 'price7d';
  const teal = getComputedStyle(document.documentElement)
    .getPropertyValue('--teal')
    .trim();

  const [data, setData] = useState(dataMap.get(initialFilter));

  const onChange = useCallback(
    (option: SingleValue<DropdownChartOptionType>) => {
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

  useFetchGrowthPrice();
  useEffect(onInitialLoad, [onInitialLoad]);

  return (
    <div className={styles.chart}>
      <div className={styles.wrapper}>
        <div className={styles.left}>
          <div className={styles.label}>Current Price</div>
          <div className={styles.price}>{currentPrice}</div>

          <span className={classNames(styles.change, styles[priceChangeTrend])}>
            <FontAwesomeIcon
              icon={trendIcon.get(priceChangeTrend) || faCircleMinus}
              className={styles.icon}
            />

            <span className={styles.percentage}>{priceChange24h}</span>
          </span>
        </div>

        <div className={styles.right}>
          <DropdownChart options={filters} onChange={onChange} />
        </div>
      </div>

      <ResponsiveContainer height={75} width='100%'>
        <AreaChart data={data} margin={{ left: 0, right: 0 }}>
          <defs>
            <linearGradient id='priceGradient' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor={teal} stopOpacity={0.15} />
              <stop offset='95%' stopColor={teal} stopOpacity={0} />
            </linearGradient>
          </defs>

          <Area
            type='monotone'
            dataKey='value'
            stroke={teal}
            fill='url(#priceGradient)'
            activeDot={{ stroke: teal }}
          />

          <Tooltip content={CustomTooltip} cursor={false} />
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
