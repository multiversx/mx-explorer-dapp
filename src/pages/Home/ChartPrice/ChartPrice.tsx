import React, { useCallback, useEffect, useState } from 'react';
import {
  faCircleUp,
  faCircleDown,
  faCircleMinus
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { SingleValue } from 'react-select';

import { useFetchGrowthPrice } from 'hooks';
import { growthPriceSelector } from 'redux/selectors';
import { TrendEnum } from 'types';

import type { StatisticType } from './types';
import type { ChartSelectOptionType } from '../ChartSelect/types';

import { ChartRoot } from '../ChartRoot';
import { ChartSelect } from '../ChartSelect';

import { PriceStatisticsLabelEnum } from './enum';

import styles from './styles.module.scss';

export const ChartPrice = () => {
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

  const filters: ChartSelectOptionType[] = [
    {
      label: '7d',
      value: 'price7d'
    },
    {
      label: '30d',
      value: 'price30d'
    },
    {
      label: '365d',
      value: 'price365d'
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

  const price365d = priceAll.slice(priceAll.length - 365, priceAll.length);
  const dataMap = new Map([
    ['price7d', price7d],
    ['price30d', price30d],
    ['price365d', price365d],
    ['priceAll', priceAll]
  ]);

  const trendIcon = new Map([
    [TrendEnum.up, faCircleUp],
    [TrendEnum.down, faCircleDown],
    [TrendEnum.neutral, faCircleMinus]
  ]);

  const initialFilter = 'price30d';
  const teal = getComputedStyle(document.documentElement)
    .getPropertyValue('--teal')
    .trim();

  const defaultValue = filters.find((filter) => filter.value === initialFilter);
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
          <ChartSelect
            options={filters}
            onChange={onChange}
            defaultValue={defaultValue}
          />
        </div>
      </div>

      <div className={styles.root}>
        <ChartRoot
          data={data}
          height={300}
          color={teal}
          identifier='priceGradient'
          tooltipFormatter={(option: any) =>
            new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              maximumFractionDigits: 2,
              minimumFractionDigits: 2
            }).format(option.value)
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
