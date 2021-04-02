import * as React from 'react';
import { StatisticsChart, Loader, adapter } from 'sharedComponents';
import { useGlobalState } from 'context';

type ChartResponseType = { time: string; value: number }[];

const StakingChart = () => {
  const ref = React.useRef(null);
  const { activeNetworkId } = useGlobalState();
  const { getTotalStakedHistory, getUsersStaking, getEconomics } = adapter();

  const [totalStaked, setTotalStaked] = React.useState('...');
  const [usersStaking, setUsersStaking] = React.useState('...');
  const [chartData, setChartData] = React.useState<ChartResponseType>([]);

  const getData = () => {
    if (ref.current !== null) {
      Promise.all([getTotalStakedHistory(), getUsersStaking(), getEconomics()]).then(
        ([totalStakedData, usersStakingData, economicsData]) => {
          const usersStaking = usersStakingData.success
            ? parseInt(usersStakingData.data).toLocaleString('en')
            : '...';
          const totalStaked = economicsData.success
            ? parseInt(economicsData.data.staked).toLocaleString('en')
            : '...';

          if (ref.current !== null) {
            setTotalStaked(totalStaked);
            setUsersStaking(usersStaking);
            totalStakedData.success ? setChartData(totalStakedData.data) : setChartData([]);
          }
        }
      );
    }
  };
  React.useEffect(getData, [activeNetworkId]);

  return (
    <div className="card staking-chart" ref={ref}>
      <div className="card-header">
        <div className="card-header-item d-flex align-items-center">
          <h6 className="mb-0">Staking Metrics</h6>
        </div>
      </div>
      <div className="card-body px-spacer pb-spacer">
        <div className="card-details mb-lg-n5">
          <div>
            <small className="text-secondary pr-3">Total Staked: </small>
            <span>{totalStaked}</span>
          </div>
          <div>
            <small className="text-secondary pr-3">Users Staking: </small>
            <span>{usersStaking}</span>
          </div>
        </div>
        {chartData.length > 0 ? (
          <StatisticsChart
            chartData={chartData}
            label="Total Staked"
            showYaxis={false}
            type="lineWithVertical"
          />
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
};

export default StakingChart;
