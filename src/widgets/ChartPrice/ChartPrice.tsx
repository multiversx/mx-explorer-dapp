import { useCallback, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { SingleValue } from 'react-select';

import { SelectOptionType } from 'components';
import { getPrimaryColor } from 'helpers';
import { useFetchGrowthPrice } from 'hooks';
import { faCircleUp, faCircleDown, faCircleMinus } from 'icons/solid';
import { growthPriceSelector } from 'redux/selectors';
import { PriceStatisticsLabelEnum, StatisticType, TrendEnum } from 'types';

import { ChartCard, ChartRoot } from '../ChartCard';

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
    isDataReady
  } = useSelector(growthPriceSelector);

  const filters: SelectOptionType[] = [
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
  const primary = getPrimaryColor();

  const defaultValue = filters.find((filter) => filter.value === initialFilter);
  const [data, setData] = useState(dataMap.get(initialFilter));

  const handleChange = useCallback(
    (option: SingleValue<SelectOptionType>) => {
      if (option && option.value && isDataReady) {
        setData(dataMap.get(String(option.value)));
      }
    },
    [isDataReady]
  );

  const onInitialLoad = useCallback(() => {
    if (isDataReady) {
      setData(dataMap.get(initialFilter));
    }
  }, [isDataReady]);

  useFetchGrowthPrice();
  useEffect(onInitialLoad, [onInitialLoad]);

  return (
    <ChartCard
      title='Current Price'
      value={currentPrice}
      filters={filters}
      defaultFilterValue={defaultValue}
      onChange={handleChange}
      className='chart-price'
      statistics={statistics}
      subtitle={
        <span className={classNames('chart-card-change', priceChangeTrend)}>
          <FontAwesomeIcon
            icon={trendIcon.get(priceChangeTrend) || faCircleMinus}
            className='icon'
          />

          <span className='percentage'>{priceChange24h} today</span>
        </span>
      }
    >
      <ChartRoot
        data={data}
        height={75}
        color={primary}
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
    </ChartCard>
  );
};
