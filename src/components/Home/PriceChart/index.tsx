import * as React from 'react';
import { StatisticsChart, Loader, adapter } from 'sharedComponents';

const PriceChart = () => {
  const { getEgldPrice } = adapter();
  const [chartData, setChartData] = React.useState<any>([]);

  React.useEffect(() => {
    getEgldPrice().then((chartData) => {
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
        <div className="card-header-item d-flex justify-content-between align-items-center">
          <h6 className="m-0">Price</h6>
        </div>
      </div>
      <div className="card-body">
        {chartData.length > 0 ? <StatisticsChart chartData={chartData} /> : <Loader />}
      </div>
    </div>
  );
};

export default PriceChart;
