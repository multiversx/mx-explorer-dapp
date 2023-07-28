import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { SingleValue } from 'react-select';

import { useFetchGrowthTransactions } from 'hooks';
import { growthTransactionsSelector } from 'redux/selectors';

import { TransactionsStatisticsLabelEnum } from './enum';
import styles from './styles.module.scss';
import { StatisticType } from './types';

import { ChartArea } from '../ChartArea';
import { PayloadType } from '../ChartArea/types';
import { ChartSelect } from '../ChartSelect';
import { ChartSelectOptionType } from '../ChartSelect/types';

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

  const [white, primary, violet500] = ['white', 'primary', 'violet-500'].map(
    (color) =>
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
      label: '365d',
      value: 'transactions365d'
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
      label: TransactionsStatisticsLabelEnum.Applications,
      value: scResults,
      color: primary
    },
    {
      label: TransactionsStatisticsLabelEnum.Standard,
      value: transactions,
      color: violet500
    }
  ];

  const transactions365d = transactionsAll.slice(
    transactionsAll.length - 365,
    transactionsAll.length
  );

  const scResults365d = scResultsAll.slice(
    scResultsAll.length - 365,
    scResultsAll.length
  );

  const dataTransactions = useMemo(
    () =>
      new Map([
        ['transactions7d', transactions7d],
        ['transactions30d', transactions30d],
        ['transactions365d', transactions365d],
        ['transactionsAll', transactionsAll]
      ]),
    [transactions7d, transactions30d, transactionsAll]
  );

  const dataContracts = useMemo(
    () =>
      new Map([
        ['scResults7d', scResults7d],
        ['scResults30d', scResults30d],
        ['scResults365d', scResults365d],
        ['scResultsAll', scResultsAll]
      ]),
    [scResults7d, scResults30d, scResultsAll]
  );

  const [transactionsPayload, setTransactionsPayload] = useState(
    dataTransactions.get('transactions30d')
  );

  const [contractsPayload, setContractsPayload] = useState(
    dataContracts.get('scResults30d')
  );

  const defaultValue = filters.find(
    (filter) => filter.value === 'transactions30d'
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
      setTransactionsPayload(dataTransactions.get('transactions30d'));
      setContractsPayload(dataContracts.get('scResults30d'));
    }
  }, [dataTransactions, dataContracts]);

  useFetchGrowthTransactions();
  useEffect(onInitialLoad, [onInitialLoad]);

  const payload: PayloadType[] = [
    {
      data: contractsPayload,
      key: 'contractValue',
      label: 'Applications',
      color: primary
    },
    {
      data: transactionsPayload,
      key: 'transactionValue',
      label: 'Standard',
      color: violet500
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
          <ChartSelect
            options={filters}
            onChange={onChange}
            defaultValue={defaultValue}
          />
        </div>

        <ChartArea payload={payload} />
      </div>
    </div>
  );
};
