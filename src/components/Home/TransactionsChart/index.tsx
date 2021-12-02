import * as React from 'react';
import { faChartBar } from '@fortawesome/pro-regular-svg-icons/faChartBar';
import { StatisticsChart, Loader, PageState, adapter } from 'sharedComponents';
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
  const [dataReady, setDataReady] = React.useState<boolean | undefined>();
  const [chartData, setChartData] = React.useState<ChartResponseType>([]);

  const getData = () => {
    if (ref.current !== null) {
      Promise.all([getStats(), getTransactionsHistory()]).then(
        ([statsData, transactionHistoryData]) => {
          if (ref.current !== null) {
            setData(processStats(statsData));
            setDataReady(transactionHistoryData.success);
            if (transactionHistoryData.success) {
              setChartData(transactionHistoryData.data);
            }
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(getData, [activeNetworkId]);

  return (
    <div className="card transactions-chart" ref={ref}>
      <div className="card-header">
        <div className="card-header-item d-flex align-items-center">
          <h6 className="mb-0">Daily Transactions</h6>
        </div>
      </div>
      <div className="card-body pr-1 pr-sm-3 pb-3">
        <div className="card-details pl-3 pb-3">
          <div>
            <small className="text-secondary pr-3">Transactions Today: </small>
            <span>{getDailyTransactions(chartData)}</span>
          </div>
          <div>
            <small className="text-secondary pr-3">Total Transactions: </small>
            <span>{data.transactions}</span>
          </div>
        </div>
        {dataReady === undefined && <Loader small={true} />}
        {dataReady === false && (
          <PageState
            icon={faChartBar}
            title="Unable to load chart"
            className="my-auto"
            titleClassName="mt-0"
            dataTestId="transactionsChartError"
          />
        )}
        {dataReady === true && chartData.length > 0 && (
          <div className="ml-n3">
            <StatisticsChart
              chartData={chartData}
              type="bar"
              label="Transactions"
              showYaxis={true}
              aspectRatio={3.85}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsChart;
