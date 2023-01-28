import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { SingleValue } from 'react-select';
import {
  Area,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  TooltipProps
} from 'recharts';

import { useFetchGrowthTransactions } from 'hooks';
import { growthTransactionsSelector } from 'redux/selectors';

import { TransactionsStatisticsLabelEnum } from './enum';
import styles from './styles.module.scss';
import type { ChartType, StatisticType } from './types';
import { ChartRoot } from '../ChartRoot';
import { ChartSelect } from '../ChartSelect';
import type { ChartSelectOptionType } from '../ChartSelect/types';

export const ChartContractsTransactions = () => {
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

  const filters: ChartSelectOptionType[] = [
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
    (option: SingleValue<ChartSelectOptionType>) => {
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
          <ChartSelect options={filters} onChange={onChange} />
        </div>

        {charts.map((chart) => (
          <div className={styles.chart} key={chart.identifier}>
            <ChartRoot
              data={chart.data}
              color={chart.color}
              identifier={chart.identifier}
              syncId='transactions-contracts-charts'
              tooltipFormatter={(option: any) => option.value.toLocaleString()}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
