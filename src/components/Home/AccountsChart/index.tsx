import * as React from 'react';
import { StatisticsChart, Loader, adapter } from 'sharedComponents';
import { useGlobalState } from 'context';
import { processStats } from 'helpers';
import { initialStats } from 'helpers/processStats';

type ChartResponseType = { time: string; value: number }[];
const initialState = {
  ...initialStats,
};

const AccountsChart = () => {
  const ref = React.useRef(null);
  const { activeNetworkId } = useGlobalState();
  const { getStats, getAccountsHistory } = adapter();

  const [data, setData] = React.useState(initialState);
  const [chartData, setChartData] = React.useState<ChartResponseType>([]);

  const getData = () => {
    if (ref.current !== null) {
      Promise.all([getStats(), getAccountsHistory()]).then(([statsData, accountsHistoryData]) => {
        if (ref.current !== null) {
          setData(processStats(statsData));
          accountsHistoryData.success ? setChartData(accountsHistoryData.data) : setChartData([]);
        }
      });
    }
  };
  const getDailyAccounts = (chartData: ChartResponseType) => {
    if (chartData.length >= 2) {
      const lastDayAccounts = chartData[chartData.length - 1].value;
      const penultimateDayAccounts = chartData[chartData.length - 2].value;

      return (lastDayAccounts - penultimateDayAccounts).toLocaleString('en');
    }
    return '...';
  };
  React.useEffect(getData, [activeNetworkId]);

  return (
    <div className="card accounts-chart" ref={ref}>
      <div className="card-header">
        <div className="card-header-item d-flex align-items-center">
          <h6 className="mb-0">Address Metrics</h6>
        </div>
      </div>
      <div className="card-body px-spacer pb-spacer">
        <div className="card-details">
          <div>
            <small className="text-secondary pr-3">Total Addresses: </small>
            <span>{data.accounts}</span>
          </div>
          <div>
            <small className="text-secondary pr-3">Daily Addresses: </small>
            <span>{getDailyAccounts(chartData)}</span>
          </div>
        </div>
        {chartData.length > 0 ? (
          <StatisticsChart
            chartData={chartData}
            label="Total Addresses"
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

export default AccountsChart;
