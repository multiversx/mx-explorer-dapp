import React from 'react';
import { faChartBar } from '@fortawesome/pro-regular-svg-icons/faChartBar';
import BigNumber from 'bignumber.js';

import { Chart, Loader, PageState, useAdapter } from 'components';
import { ChartDataType, ChartConfigType } from 'components/Chart/helpers/types';
import { formatDataCharts } from 'components/Chart/helpers/formatDataCharts';

import { useGlobalState } from 'context';

export const StakingChart = () => {
  const { activeNetworkId, economics } = useGlobalState();
  const { getTotalStakedHistory } = useAdapter();

  const [usersStaking, setUsersStaking] = React.useState('...');
  const [dataReady, setDataReady] = React.useState<boolean | undefined>();
  const [chartData, setChartData] = React.useState<ChartDataType[]>([]);

  const getData = () => {
    getTotalStakedHistory().then((totalStakedData) => {
      if (totalStakedData.success) {
        const stakedChart = totalStakedData.data?.[0]?.data?.[0]?.all;
        const usersStakingStatistics = totalStakedData.data?.[0]?.statistics?.usersStaking;

        if (usersStakingStatistics) {
          setUsersStaking(usersStakingStatistics);
        }
        if (stakedChart) {
          setChartData(formatDataCharts(stakedChart));
        }
      }

      setDataReady(totalStakedData.success);
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(getData, [activeNetworkId]);

  const percentage = economics.totalStakedPercent;
  const total = economics.staked;
  const users = usersStaking !== '...' ? new BigNumber(usersStaking).toFormat(0) : '...';

  const config: ChartConfigType[] = [
    {
      id: 'totalStaked',
      label: 'totalStaked',
      gradient: 'defaultGradient',
      data: chartData,
    },
  ];

  const metrics = [
    { label: 'Total Staked', value: `${total} / ${percentage}` },
    { label: 'Users Staking', value: users },
  ];

  return (
    <section id="staking" className="staking card">
      <Chart.Heading title="Staking Metrics"></Chart.Heading>

      <Chart.Body>
        {dataReady === undefined && <Loader />}
        {dataReady === false && (
          <PageState
            icon={faChartBar}
            title="Unable to load chart"
            className="py-spacer my-auto"
            titleClassName="mt-0"
            dataTestId="stakingChartError"
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
