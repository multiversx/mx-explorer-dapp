import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Area,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  TooltipProps
} from 'recharts';
import { SingleValue } from 'react-select';

import { growthTransactionsSelector } from 'redux/selectors';
import { useFetchGrowthTransactions } from 'hooks';

import { DropdownChart } from '../DropdownChart';

import { TransactionsStatisticsLabelEnum } from './enum';

import type { DropdownChartOptionType } from '../DropdownChart/types';
import type { ChartType, StatisticType } from './types';

import styles from './styles.module.scss';

const CustomTooltip = (props: TooltipProps<number, string>) => {
  const { payload, active } = props;

  if (!payload || !active) {
    return null;
  }

  return (
    <div className={styles.tooltip}>
      {payload.map((item: any) => (
        <div key={item.value}>{item.value.toLocaleString()}</div>
      ))}
    </div>
  );
};

export const LongChart = () => {
  const {
    scResults,
    transactions,
    totalTransactions,
    transactions7d,
    transactions30d,
    transactionsAll,
    scResults7d,
    scResults30d,
    scResultsAll,
    isFetched
  } = useSelector(growthTransactionsSelector);

  const [white, teal, purple] = ['white', 'teal', 'purple'].map((color) =>
    getComputedStyle(document.documentElement)
      .getPropertyValue(`--${color}`)
      .trim()
  );

  const filters: DropdownChartOptionType[] = [
    {
      label: '7d',
      value: 'transactions7d'
    },
    {
      label: '30d',
      value: 'transactions30d'
    },
    {
      label: 'All',
      value: 'transactionsAll'
    }
  ];

  const statistics: StatisticType[] = [
    {
      label: TransactionsStatisticsLabelEnum.Transactions,
      value: totalTransactions,
      color: white
    },
    {
      label: TransactionsStatisticsLabelEnum.SmartContracts,
      value: scResults,
      color: teal
    },
    {
      label: TransactionsStatisticsLabelEnum.Standard,
      value: transactions,
      color: purple
    }
  ];

  const dataTransactions = useMemo(
    () =>
      new Map([
        ['transactions7d', transactions7d],
        ['transactions30d', transactions30d],
        ['transactionsAll', transactionsAll]
      ]),
    [transactions7d, transactions30d, transactionsAll]
  );

  const dataContracts = useMemo(
    () =>
      new Map([
        ['scResults7d', scResults7d],
        ['scResults30d', scResults30d],
        ['scResultsAll', scResultsAll]
      ]),
    [scResults7d, scResults30d, scResultsAll]
  );

  const [transactionsPayload, setTransactionsPayload] = useState(
    dataTransactions.get('transactions7d')
  );

  const [contractsPayload, setContractsPayload] = useState(
    dataContracts.get('scResults7d')
  );

  const onChange = useCallback(
    (option: SingleValue<DropdownChartOptionType>) => {
      if (option && option.value && isFetched) {
        const value = option.value.replace('transactions', '');
        const [transactionsKey, contractsKey] = [
          `transactions${value}`,
          `scResults${value}`
        ];

        setTransactionsPayload(dataTransactions.get(transactionsKey));
        setContractsPayload(dataContracts.get(contractsKey));
      }
    },
    [isFetched]
  );

  const onInitialLoad = useCallback(() => {
    if (isFetched) {
      setTransactionsPayload(dataTransactions.get('transactions7d'));
      setContractsPayload(dataContracts.get('scResults7d'));
    }
  }, [dataTransactions, dataContracts]);

  useFetchGrowthTransactions();
  useEffect(onInitialLoad, [onInitialLoad]);

  const charts: ChartType[] = [
    {
      color: teal,
      identifier: 'contracts',
      data: contractsPayload
    },
    {
      color: purple,
      identifier: 'transactions',
      data: transactionsPayload
    }
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.statistics}>
        {statistics.map((statistic) => (
          <div key={statistic.label} className={styles.statistic}>
            <div className={styles.label}>{statistic.label}</div>
            <div className={styles.value} style={{ color: statistic.color }}>
              {statistic.value}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.charts}>
        <div className={styles.filters}>
          <DropdownChart options={filters} onChange={onChange} />
        </div>

        {charts.map((chart) => (
          <div className={styles.chart} key={chart.identifier}>
            <ResponsiveContainer height={75} width='100%'>
              <AreaChart
                data={chart.data}
                margin={{ left: 0, right: 0 }}
                syncId='transactions-contracts-charts'
              >
                <defs>
                  <linearGradient
                    id={chart.identifier}
                    x1='0'
                    y1='0'
                    x2='0'
                    y2='1'
                  >
                    <stop
                      offset='5%'
                      stopColor={chart.color}
                      stopOpacity={0.15}
                    />

                    <stop
                      offset='95%'
                      stopColor={chart.color}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <Area
                  type='monotone'
                  dataKey='value'
                  stroke={chart.color}
                  fill={`url(#${chart.identifier})`}
                  activeDot={{ stroke: chart.color, fill: chart.color }}
                />

                <Tooltip content={CustomTooltip} cursor={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </div>
  );
};
