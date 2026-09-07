import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

const FILTERS: SelectOptionType[] = [
  { label: '7d', value: 'price7d' },
  { label: '30d', value: 'price30d' },
  { label: '365d', value: 'price365d' },
  { label: 'All', value: 'priceAll' }
];

const TREND_ICONS = new Map([
  [TrendEnum.up, faCircleUp],
  [TrendEnum.down, faCircleDown],
  [TrendEnum.neutral, faCircleMinus]
]);

const INITIAL_FILTER = 'price30d';
const DEFAULT_FILTER_VALUE = FILTERS.find(
  (filter) => filter.value === INITIAL_FILTER
);

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
  minimumFractionDigits: 2
});

const formatPriceTooltip = (option: any) => priceFormatter.format(option.value);

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

  const statistics: StatisticType[] = useMemo(
    () => [
      { label: PriceStatisticsLabelEnum.MarketCap, value: marketCap },
      { label: PriceStatisticsLabelEnum.Volume24h, value: volume24h }
    ],
    [marketCap, volume24h]
  );

  const dataMap = useMemo(() => {
    const price365d = priceAll.slice(priceAll.length - 365, priceAll.length);

    return new Map([
      ['price7d', price7d],
      ['price30d', price30d],
      ['price365d', price365d],
      ['priceAll', priceAll]
    ]);
  }, [price7d, price30d, priceAll]);

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

  useFetchGrowthPrice();
  useEffect(onInitialLoad, [onInitialLoad]);

  return (
    <ChartCard
      title='Current Price'
      value={currentPrice}
      filters={FILTERS}
      defaultFilterValue={DEFAULT_FILTER_VALUE}
      onChange={handleChange}
      className='chart-price'
      statistics={statistics}
      subtitle={
        <span className={classNames('chart-card-change', priceChangeTrend)}>
          <FontAwesomeIcon
            icon={TREND_ICONS.get(priceChangeTrend) || faCircleMinus}
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
        tooltipFormatter={formatPriceTooltip}
      />
    </ChartCard>
  );
};
