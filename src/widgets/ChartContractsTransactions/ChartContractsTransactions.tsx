import { useCallback, useEffect, useMemo, useState } from 'react';
import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { SingleValue } from 'react-select';

import { Select, SelectOptionType } from 'components';
import { getColors } from 'helpers';
import { useFetchGrowthTransactions } from 'hooks';
import { growthTransactionsSelector } from 'redux/selectors';
import {
  GrowthChartDataType,
  StatisticType,
  TransactionsStatisticsLabelEnum
} from 'types';

import { ChartArea } from './ChartArea';
import { PayloadType } from './ChartArea/types';
import { ChartContractsTransactionsUIType } from './types';

const getSum = (
  first: GrowthChartDataType[],
  second: GrowthChartDataType[]
) => {
  const dayData = [...first, ...second].reduce(
    ((map) => (acc: any, cur) => {
      map.set(
        cur.timestamp,
        map.get(cur.timestamp) ||
          acc[acc.push({ timestamp: cur.timestamp, value: 0 }) - 1]
      );
      const currentEntry = map.get(cur.timestamp);

      currentEntry.value = new BigNumber(currentEntry.value)
        .plus(new BigNumber(cur.value))
        .toNumber();

      return acc;
    })(new Map()),
    []
  ) as GrowthChartDataType[];

  return dayData;
};

export const ChartContractsTransactions = ({
  title,
  customStatistics = [],
  showStatistics = true,
  showTransactions = true,
  showContracts = true,
  showTotal = true,
  simpleTooltip = false,
  hasBorder = false,
  isStandalone,
  className
}: ChartContractsTransactionsUIType) => {
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
    isDataReady
  } = useSelector(growthTransactionsSelector);

  const [success, primary, violet500] = getColors([
    'success',
    'primary',
    'violet-500'
  ]);

  const filters: SelectOptionType[] = [
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

  const statistics: StatisticType[] =
    customStatistics.length > 0
      ? customStatistics
      : [
          {
            label: TransactionsStatisticsLabelEnum.Transactions,
            value: totalTransactions,
            color: primary
          },
          {
            label: TransactionsStatisticsLabelEnum.Applications,
            value: scResults,
            color: showTotal ? success : primary
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

  const dataTotal = useMemo(
    () =>
      new Map([
        ['total7d', getSum(transactions7d, scResults7d)],
        ['total30d', getSum(transactions30d, scResults30d)],
        ['total365d', getSum(transactions365d, scResults365d)],
        ['totalAll', getSum(transactionsAll, scResultsAll)]
      ]),
    [
      transactions7d,
      transactions30d,
      transactionsAll,
      scResults7d,
      scResults30d,
      scResultsAll
    ]
  );

  const [transactionsPayload, setTransactionsPayload] = useState(
    dataTransactions.get('transactions30d')
  );
  const [contractsPayload, setContractsPayload] = useState(
    dataContracts.get('scResults30d')
  );
  const [totalPayload, setTotalPayload] = useState(dataTotal.get('total30d'));

  const defaultValue = filters.find(
    (filter) => filter.value === 'transactions30d'
  );

  const onChange = useCallback(
    (option: SingleValue<SelectOptionType>) => {
      if (option && option.value && isDataReady) {
        const value = String(option.value).replace('transactions', '');
        const [transactionsKey, contractsKey, totalKey] = [
          `transactions${value}`,
          `scResults${value}`,
          `total${value}`
        ];

        setTransactionsPayload(dataTransactions.get(transactionsKey));
        setContractsPayload(dataContracts.get(contractsKey));
        setTotalPayload(dataTotal.get(totalKey));
      }
    },
    [isDataReady]
  );

  const onInitialLoad = useCallback(() => {
    if (isDataReady) {
      setTransactionsPayload(dataTransactions.get('transactions30d'));
      setContractsPayload(dataContracts.get('scResults30d'));
      setTotalPayload(dataTotal.get('total30d'));
    }
  }, [dataTransactions, dataContracts, dataTotal]);

  useFetchGrowthTransactions();
  useEffect(onInitialLoad, [onInitialLoad]);

  const payload: PayloadType[] = [
    ...(showTotal
      ? [
          {
            data: totalPayload,
            key: 'totalValue',
            label: 'Total Transactions',
            color: primary
          }
        ]
      : []),
    ...(showContracts
      ? [
          {
            data: contractsPayload,
            key: 'contractValue',
            label: 'Applications',
            color: showTotal ? success : primary
          }
        ]
      : []),
    ...(showTransactions
      ? [
          {
            data: transactionsPayload,
            key: 'transactionValue',
            label: 'Standard',
            color: violet500
          }
        ]
      : [])
  ];

  return (
    <div className={classNames(className, 'chart-contracts-transactions')}>
      {showStatistics && (
        <div className='statistics'>
          {statistics.map((statistic) => (
            <div key={statistic.label} className='statistic'>
              <div className='label'>{statistic.label}</div>
              <div className='value' style={{ color: statistic.color }}>
                {statistic.value}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className={classNames('charts', { 'has-border': hasBorder })}>
        <div className='headerwrapper'>
          {title && <h5 className='title'>{title}</h5>}
          <div className='filters'>
            <Select
              options={filters}
              onChange={onChange}
              defaultValue={defaultValue}
            />
          </div>
        </div>
        <ChartArea
          payload={payload}
          simpleTooltip={simpleTooltip}
          {...(isStandalone ? { height: 244 } : {})}
        />
      </div>
    </div>
  );
};
