import * as React from 'react';
import { StatisticsChart, Loader, adapter } from 'sharedComponents';
import { useGlobalState } from 'context';

type ActiveChartType = 'price' | 'marketcap';
type ChartResponseType = { time: string; value: number }[];

const PriceChart = () => {
  const ref = React.useRef(null);
  const { activeNetworkId } = useGlobalState();

  const { getEgldPriceHistory, getEgldMarketCapHistory, getEgldVolumeHistory } = adapter();
  const [chartData, setChartData] = React.useState<ChartResponseType>([]);
  const [priceChartData, setPriceChartData] = React.useState<ChartResponseType>([]);
  const [marketCapChartData, setMarketCapChartData] = React.useState<ChartResponseType>([]);
  const [volumeChartData, setVolumeChartData] = React.useState<ChartResponseType>([]);
  const [activeChart, setActiveChart] = React.useState<ActiveChartType>('price');

  const getData = () => {
    if (ref.current !== null) {
      Promise.all([getEgldPriceHistory(), getEgldMarketCapHistory(), getEgldVolumeHistory()]).then(
        ([priceHistoryData, marketCapHistoryData, volumeHistoryData]) => {
          if (ref.current !== null) {
            priceHistoryData.success
              ? setPriceChartData(priceHistoryData.data)
              : setPriceChartData([]);

            marketCapHistoryData.success
              ? setMarketCapChartData(marketCapHistoryData.data)
              : setMarketCapChartData([]);

            volumeHistoryData.success
              ? setVolumeChartData(volumeHistoryData.data)
              : setVolumeChartData([]);
          }
        }
      );
    }
  };
  React.useEffect(getData, [activeNetworkId]);

  React.useEffect(() => {
    if (activeChart === 'price' && priceChartData.length > 0) {
      setChartData(priceChartData);
    }
    if (activeChart === 'marketcap' && marketCapChartData.length > 0) {
      setChartData(marketCapChartData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChart, priceChartData]);

  const getCurrentValue = (chartData: ChartResponseType) => {
    if (chartData.length >= 1) {
      const value = chartData[chartData.length - 1].value;
      return `$${value.toLocaleString('en', { maximumFractionDigits: value > 1000 ? 0 : 2 })}`;
    }
    return '...';
  };

  return (
    <div className="card price-chart" ref={ref}>
      <div className="card-header">
        <div className="card-header-item d-flex align-items-center">
          <h6
            className={`mb-0 ${activeChart === 'price' ? '' : 'text-muted'}`}
            onClick={() => {
              setActiveChart('price');
            }}
            style={{ cursor: 'pointer' }}
          >
            Price
          </h6>
          <h6
            className={`pl-3 mb-0 ${activeChart === 'marketcap' ? '' : 'text-muted'}`}
            onClick={() => {
              setActiveChart('marketcap');
            }}
            style={{ cursor: 'pointer' }}
          >
            Market Cap
          </h6>
        </div>
      </div>
      <div className="card-body">
        <div className="pl-3">
          <div className="card-details mb-lg-n5">
            <div>
              <small className="text-secondary pr-3">Current Price: </small>
              <span>{getCurrentValue(priceChartData)}</span>
            </div>
            <div>
              <small className="text-secondary pr-3">Market Cap: </small>
              <span>{getCurrentValue(marketCapChartData)}</span>
            </div>
          </div>
          {chartData.length > 0 ? (
            <div className="pt-5 pb-3">
              <StatisticsChart
                chartData={chartData}
                displayType="price"
                type="lineWithVertical"
                label="USD"
                formatMoney={true}
                showYaxis={true}
                aspectRatio={3}
              />
            </div>
          ) : (
            <Loader />
          )}
          {volumeChartData.length > 0 && (
            <StatisticsChart
              chartData={volumeChartData}
              displayType="small"
              type="bar"
              label="Volume 24h"
              formatMoney={true}
              showYaxis={false}
              aspectRatio={8}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PriceChart;
