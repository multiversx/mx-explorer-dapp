import * as React from 'react';
import { faChartBar } from '@fortawesome/pro-regular-svg-icons/faChartBar';
import { StatisticsChart, Loader, PageState, adapter } from 'sharedComponents';
import { useGlobalState } from 'context';

type ChartResponseType = { time: string; value: number }[];

const initialState = {
  usersStaking: '...',
  totalStaked: '...',
  percentageStaked: '...',
};

const StakingChart = () => {
  const ref = React.useRef(null);
  const { activeNetworkId } = useGlobalState();
  const { getTotalStakedHistory, getUsersStaking, getEconomics } = adapter();

  const [data, setData] = React.useState(initialState);
  const [dataReady, setDataReady] = React.useState<boolean | undefined>();
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
          const percentageStaked = economicsData.success
            ? `${(
                (parseInt(economicsData.data.staked) /
                  parseInt(economicsData.data.circulatingSupply)) *
                100
              ).toFixed()}%`
            : '...';

          if (ref.current !== null) {
            setData({ usersStaking, totalStaked, percentageStaked });
            setDataReady(totalStakedData.success);
            if (totalStakedData.success) {
              setChartData(totalStakedData.data);
            }
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
      <div className="card-body pr-1 pr-sm-3 pb-3">
        <div className="card-details pl-3">
          <div>
            <small className="text-secondary pr-3">Total Staked: </small>
            <span>
              {data.totalStaked} / {data.percentageStaked}
            </span>
          </div>
          <div>
            <small className="text-secondary pr-3">Users Staking: </small>
            <span>{data.usersStaking}</span>
          </div>
        </div>
        {dataReady === undefined && <Loader small={true} />}
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
          <div className="ml-n3">
            <StatisticsChart
              chartData={chartData}
              label="Total Staked"
              showYaxis={true}
              type="lineWithVertical"
              aspectRatio={2.5}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default StakingChart;
