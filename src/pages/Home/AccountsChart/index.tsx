import React from 'react';
import { faChartBar } from '@fortawesome/pro-regular-svg-icons/faChartBar';
import BigNumber from 'bignumber.js';

import { Chart, Loader, PageState, adapter } from 'components';
import getLastDayValue from 'components/Chart/helpers/getLastDayValue';
import { ChartDataType, ChartConfigType } from 'components/Chart/helpers/types';
import formatDataCharts from 'components/Chart/helpers/formatDataCharts';

import { useGlobalState } from 'context';

const AccountsChart = () => {
  const { activeNetworkId, stats } = useGlobalState();
  const { getAccountsHistory } = adapter();

  const [dataReady, setDataReady] = React.useState<boolean | undefined>();
  const [chartData, setChartData] = React.useState<ChartDataType[]>([]);

  const getData = () => {
    getAccountsHistory().then((accountsHistoryData) => {
      if (accountsHistoryData.success) {
        const accountsChart = accountsHistoryData.data?.[0]?.data?.[0]?.all;

        if (accountsChart) {
          setChartData(formatDataCharts(accountsChart));
        }
      }
      setDataReady(accountsHistoryData.success);
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(getData, [activeNetworkId]);

  const config: ChartConfigType[] = [
    {
      id: 'totalAddresses',
      label: 'totalAddresses',
      gradient: 'defaultGradient',
      data: chartData,
    },
  ];

  const totalAccounts =
    stats.accounts !== '...' ? new BigNumber(stats.accounts).toFormat(0) : '...';
  const metrics = [
    { label: 'New Addresses Today', value: getLastDayValue(chartData) },
    { label: 'Total Addresses', value: totalAccounts },
  ];

  return (
    <section id="accounts" className="accounts card">
      <Chart.Heading title="Address Metrics"></Chart.Heading>

      <Chart.Body>
        {dataReady === undefined && <Loader />}
        {dataReady === false && (
          <PageState
            icon={faChartBar}
            title="Unable to load chart"
            className="py-spacer my-auto"
            titleClassName="mt-0"
            dataTestId="accountsChartError"
          />
        )}
        {dataReady === true && chartData.length > 0 && (
          <>
            <Chart.Metrics {...{ metrics }} />
            <Chart.Area {...{ config }} hasOnlyStartEndTick></Chart.Area>
          </>
        )}
      </Chart.Body>
    </section>
  );
};

export default AccountsChart;
