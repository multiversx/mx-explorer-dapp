import * as React from 'react';
import { StatisticsChart, Loader, adapter } from 'sharedComponents';

type ChartResponseType = { time: string; value: number }[];

const TransactionsChart = () => {
  const {
    getEgldPriceHistory,
    getEgldMarketCapHistory,
    getEgldVolumeHistory,
    getEgldTotalStakedHistory,
    getEgldUsersStaking,
    getEgldTotalTransactions,
    getEgldTransactionsHistory,
    getEgldAccountsHistory,
  } = adapter();
  const [chartData, setChartData] = React.useState<ChartResponseType>([]);

  React.useEffect(() => {
    getEgldTransactionsHistory().then((chartData: any) => {
      const { data = [], success } = chartData;

      if (success && data.length > 0) {
        setChartData(chartData.data);
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="card price-chart">
      <div className="card-header">
        <div className="card-header-item d-flex align-items-center">
          <h6 className="mb-0">Daily Transactions</h6>
        </div>
      </div>
      <div className="card-body p-spacer">
        {chartData.length > 0 ? (
          <StatisticsChart
            chartData={chartData}
            label="Transactions"
            showYaxis={false}
            type="bar"
          />
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
};

export default TransactionsChart;
