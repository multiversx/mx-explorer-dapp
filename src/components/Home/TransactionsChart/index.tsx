import * as React from 'react';
import { StatisticsChart, Loader, adapter } from 'sharedComponents';
import { useGlobalState } from 'context';
import { processStats } from 'helpers';
import { initialStats } from 'helpers/processStats';

type ChartResponseType = { time: string; value: number }[];
const initialState = {
  ...initialStats,
};

const TransactionsChart = () => {
  const ref = React.useRef(null);
  const { activeNetworkId } = useGlobalState();
  const { getStats, getTransactionsHistory } = adapter();

  const [data, setData] = React.useState(initialState);
  const [chartData, setChartData] = React.useState<ChartResponseType>([]);

  const getData = () => {
    if (ref.current !== null) {
      Promise.all([getStats(), getTransactionsHistory()]).then(
        ([statsData, transactionHistoryData]) => {
          if (ref.current !== null) {
            setData(processStats(statsData));
            transactionHistoryData.success
              ? setChartData(transactionHistoryData.data)
              : setChartData([]);
          }
        }
      );
    }
  };
  const getDailyTransactions = (chartData: ChartResponseType) => {
    if (chartData.length >= 1) {
      return chartData[chartData.length - 1].value.toLocaleString('en');
    }
    return '...';
  };
  React.useEffect(getData, [activeNetworkId]);

  return (
    <div className="card transactions-chart" ref={ref}>
      <div className="card-header">
        <div className="card-header-item d-flex align-items-center">
          <h6 className="mb-0">Daily Transactions</h6>
        </div>
      </div>
      <div className="card-body px-spacer pb-spacer">
        <div className="card-details pb-3">
          <div>
            <small className="text-secondary pr-3">Transactions Today: </small>
            <span>{getDailyTransactions(chartData)}</span>
          </div>
          <div>
            <small className="text-secondary pr-3">Total Transactions: </small>
            <span>{data.transactions}</span>
          </div>
        </div>
        {chartData.length > 0 ? (
          <StatisticsChart
            chartData={chartData}
            displayType="grouped"
            type="bar"
            label="Transactions"
            showYaxis={false}
            aspectRatio={4}
          />
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
};

export default TransactionsChart;
