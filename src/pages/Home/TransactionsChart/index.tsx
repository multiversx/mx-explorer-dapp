import React from 'react';
import { faChartBar } from '@fortawesome/pro-regular-svg-icons/faChartBar';
import BigNumber from 'bignumber.js';

import { Chart, Loader, PageState, useAdapter } from 'components';
import { ChartDataType, ChartConfigType } from 'components/Chart/helpers/types';
import { formatDataCharts } from 'components/Chart/helpers/formatDataCharts';

import { useSelector } from 'react-redux';
import { activeNetworkSelector, statsSelector } from 'redux/selectors';

export const TransactionsChart = () => {
  const { getTransactionsHistory } = useAdapter();

  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const { statsFetched, transactions } = useSelector(statsSelector);

  const [dataReady, setDataReady] = React.useState<boolean | undefined>();
  const [chartData, setChartData] = React.useState<ChartDataType[]>([]);

  const getData = () => {
    getTransactionsHistory().then((transactionsHistoryData) => {
      if (transactionsHistoryData.success) {
        const transactionsChart = transactionsHistoryData.data?.[0]?.data?.[0]?.all;

        if (transactionsChart) {
          setChartData(formatDataCharts(transactionsHistoryData.data?.[0]?.data?.[0]?.all));
        }
      }
      setDataReady(transactionsHistoryData.success);
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(getData, [activeNetworkId]);

  const config: ChartConfigType[] = [
    {
      id: 'transactions',
      gradient: 'defaultGradient',
      data: chartData,
    },
  ];

  const totalTransactions = statsFetched ? new BigNumber(transactions).toFormat(0) : '...';
  const transactionsToday =
    chartData.length > 0 ? new BigNumber(chartData[chartData.length - 1].value).toFormat(0) : '...';
  const metrics = [
    { label: 'Transactions Today', value: transactionsToday },
    { label: 'Total Transactions', value: totalTransactions },
  ];

  return (
    <section id="transactions" className="transactions card">
      <Chart.Heading title="Daily Transactions"></Chart.Heading>

      <Chart.Body>
        {dataReady === undefined && <Loader />}
        {dataReady === false && (
          <PageState
            icon={faChartBar}
            title="Unable to load chart"
            className="py-spacer my-auto"
            titleClassName="mt-0"
            dataTestId="TransactionsChartError"
          />
        )}
        {dataReady === true && chartData.length > 0 && (
          <>
            <Chart.Metrics {...{ metrics }} />
            <Chart.Bar {...{ config }} hasOnlyStartEndTick></Chart.Bar>
          </>
        )}
      </Chart.Body>
    </section>
  );
};
