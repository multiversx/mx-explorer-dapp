import * as React from 'react';
import { StatisticsChart, Loader, adapter } from 'sharedComponents';

type ActiveChartType = 'price' | 'marketcap';
type ChartResponseType = { time: string; value: number }[];

const PriceChart = () => {
  const { getEgldPrice, getEgldMarketCap } = adapter();
  const [chartData, setChartData] = React.useState<ChartResponseType>([]);
  const [pricechartData, setPriceChartData] = React.useState<ChartResponseType>([]);
  const [marketCapChartData, setMarketCapChartData] = React.useState<ChartResponseType>([]);
  const [activeChart, setActiveChart] = React.useState<ActiveChartType>('price');

  React.useEffect(() => {
    switch (true) {
      case activeChart === 'price':
        if (pricechartData.length === 0) {
          getEgldPrice().then((chartData) => {
            const { data = [], success } = chartData;

            if (success && data.length > 0) {
              setPriceChartData(chartData.data);
              setChartData(chartData.data);
            }
          });
        } else {
          setChartData(pricechartData);
        }

        break;
      case activeChart === 'marketcap':
        if (marketCapChartData.length === 0) {
          getEgldMarketCap().then((chartData) => {
            const { data = [], success } = chartData;

            if (success && data.length > 0) {
              setMarketCapChartData(chartData.data);
              setChartData(chartData.data);
            }
          });
        } else {
          setChartData(marketCapChartData);
        }

        break;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChart]);

  return (
    <div className="card price-chart">
      <div className="card-header">
        <div className="card-header-item d-flex align-items-center">
          <h6
            className={`mb-0 ${activeChart === 'price' ? '' : 'text-muted'}`}
            onClick={() => {
              setActiveChart('price');
            }}
          >
            Price
          </h6>
          <h6
            className={`pl-3 mb-0 ${activeChart === 'marketcap' ? '' : 'text-muted'}`}
            onClick={() => {
              setActiveChart('marketcap');
            }}
          >
            Market Cap
          </h6>
        </div>
      </div>
      <div className="card-body">
        {chartData.length > 0 ? <StatisticsChart chartData={chartData} label="USD" /> : <Loader />}
      </div>
    </div>
  );
};

export default PriceChart;
