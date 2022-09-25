import React from 'react';
import { faChartBar } from '@fortawesome/pro-regular-svg-icons/faChartBar';
import BigNumber from 'bignumber.js';

import { Chart, Loader, PageState, adapter } from 'sharedComponents';
import { ChartDataType, ChartConfigType } from 'sharedComponents/Chart/helpers/types';
import formatDataCharts from 'sharedComponents/Chart/helpers/formatDataCharts';

import { useGlobalState } from 'context';

const StakingChart = () => {
  const { activeNetworkId, economics } = useGlobalState();
  const { getTotalStakedHistory, getUsersStaking } = adapter();

  const [usersStaking, setUsersStaking] = React.useState('...');
  const [dataReady, setDataReady] = React.useState<boolean | undefined>();
  const [chartData, setChartData] = React.useState<ChartDataType[]>([]);

  const getData = () => {
    Promise.all([getTotalStakedHistory(), getUsersStaking()]).then(
      ([totalStakedData, usersStakingData]) => {
        if (usersStakingData.success) {
          setUsersStaking(usersStakingData.data);
        }
        if (totalStakedData.success) {
          setChartData(formatDataCharts(totalStakedData.data));
        }

        setDataReady(usersStakingData.success && totalStakedData.success);
      }
    );
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
            className="my-auto"
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

export default StakingChart;
