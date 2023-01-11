import React, { useState } from 'react';
import { faChartBar } from '@fortawesome/pro-regular-svg-icons/faChartBar';
import BigNumber from 'bignumber.js';
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Area,
  AreaChart,
  Bar,
  Cell,
  BarChart,
  Tooltip,
} from 'recharts';

import { Chart, Loader, PageState, adapter } from 'sharedComponents';
import CustomTooltip from 'sharedComponents/Chart/helpers/CustomTooltip';
import formatDataCharts from 'sharedComponents/Chart/helpers/formatDataCharts';
import formatYAxis from 'sharedComponents/Chart/helpers/formatYAxis';
import StartEndTick from 'sharedComponents/Chart/helpers/StartEndTick';
import { ControlType, ChartDataType } from 'sharedComponents/Chart/helpers/types';

import { useGlobalState } from 'context';

const getCurrentValue = (chartData: ChartDataType[]) => {
  if (chartData.length >= 1) {
    return chartData[chartData.length - 1].value;
  }
  return '...';
};

const Price = () => {
  const { activeNetworkId } = useGlobalState();

  const { getEgldPriceHistory, getEgldMarketCapHistory } = adapter();
  const [dataReady, setDataReady] = React.useState<boolean | undefined>();
  const [chartData, setChartData] = React.useState<ChartDataType[]>([]);
  const [priceChartData, setPriceChartData] = React.useState<ChartDataType[]>([]);
  const [marketCapChartData, setMarketCapChartData] = React.useState<ChartDataType[]>([]);
  const [volumeChartData, setVolumeChartData] = React.useState<ChartDataType[]>([]);

  const [focusBar, setFocusBar] = useState<any>(null);
  const [category, setCategory] = useState<string>('price');

  const docStyle = window.getComputedStyle(document.documentElement);
  const primaryColor = docStyle.getPropertyValue('--primary');
  const mutedColor = docStyle.getPropertyValue('--muted');
  const fadedBackground = docStyle.getPropertyValue('--chart-faded-bg');

  const getData = () => {
    Promise.all([getEgldPriceHistory(), getEgldMarketCapHistory()]).then(
      ([priceHistoryData, marketCapHistoryData]) => {
        const priceChart = priceHistoryData.data?.[0]?.data?.[0]?.all;
        const volumeChart = priceHistoryData.data?.[0]?.data?.[1]?.all;
        const marketCapChart = marketCapHistoryData.data?.[0]?.data?.[0]?.all;

        if (priceHistoryData.success && priceChart) {
          setPriceChartData(formatDataCharts(priceChart));
        }
        if (priceHistoryData.success && volumeChart) {
          setVolumeChartData(formatDataCharts(volumeChart));
        }
        if (marketCapHistoryData.success && marketCapChart) {
          setMarketCapChartData(formatDataCharts(marketCapChart));
        }

        setDataReady(priceHistoryData.success && marketCapHistoryData.success);
      }
    );
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(getData, [activeNetworkId]);

  React.useEffect(() => {
    if (category === 'price' && priceChartData.length > 0) {
      setChartData(priceChartData);
    }
    if (category === 'marketCap' && marketCapChartData.length > 0) {
      setChartData(marketCapChartData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, priceChartData]);

  const controls: ControlType[] = [
    {
      comparison: category,
      callback: setCategory,
      singular: 'category',
      plural: 'categories',
      data: {
        price: 'Price',
        marketCap: 'Market Cap',
      },
    },
  ];

  const value = getCurrentValue(priceChartData);
  const volume = getCurrentValue(volumeChartData);

  const metrics = [
    { label: 'Current Price', value: `$${new BigNumber(value).toFormat()}` },
    { label: 'Volume 24h', value: `$${new BigNumber(volume).toFormat(0)}` },
  ];

  return (
    <section id="price" className="price card">
      <Chart.Heading>
        <Chart.Controls controls={controls} />
      </Chart.Heading>
      <Chart.Body>
        {dataReady === undefined && <Loader />}
        {dataReady === false && (
          <PageState
            icon={faChartBar}
            title="Unable to load chart"
            className="py-spacer my-auto"
            titleClassName="mt-0"
            dataTestId="priceChartError"
          />
        )}
        {dataReady === true && chartData.length > 0 && (
          <>
            <Chart.Metrics metrics={metrics} />
            <div className="stacked-chart">
              <ResponsiveContainer width="100%" height="70%" className="mb-n3">
                <AreaChart data={chartData} syncId="priceChart">
                  <defs>
                    <linearGradient id="defaultGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={primaryColor} stopOpacity={0.25} />
                      <stop offset="35%" stopColor={primaryColor} stopOpacity={0.4} />
                      <stop offset="95%" stopColor={primaryColor} stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <XAxis
                    dataKey="timestamp"
                    tickLine={false}
                    tick={StartEndTick as any}
                    interval={0}
                    strokeWidth={0.3}
                  />
                  <YAxis
                    orientation="right"
                    tickFormatter={(tick) => formatYAxis(tick, '$')}
                    axisLine={false}
                    tickLine={false}
                    type="number"
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    fill="url(#defaultGradient)"
                    stroke={primaryColor}
                    strokeWidth={1.5}
                  />
                  <Tooltip
                    content={(props) => <CustomTooltip {...props} currency="$" />}
                    cursor={{
                      strokeDasharray: '3 5',
                      stroke: mutedColor,
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
              <ResponsiveContainer width="100%" height={100}>
                <BarChart
                  data={volumeChartData}
                  onMouseMove={(state) => {
                    if (state.isTooltipActive) {
                      setFocusBar(state.activeTooltipIndex);
                    } else {
                      setFocusBar(null);
                    }
                  }}
                  syncId="priceChart"
                >
                  <XAxis dataKey="timestamp" tickLine={false} tick={false} strokeWidth={0.3} />
                  <YAxis
                    orientation="right"
                    tickFormatter={(tick) => formatYAxis(tick, '$')}
                    axisLine={false}
                    tickLine={false}
                    tick={false}
                  />

                  <Bar dataKey="value">
                    {volumeChartData.map((entry: any, index: number) => (
                      <Cell
                        fill={focusBar === index ? primaryColor : fadedBackground}
                        key={index}
                      />
                    ))}
                  </Bar>
                  <Tooltip
                    content={(props) => (
                      <CustomTooltip {...props} currency="$" customLabel="volume" />
                    )}
                    cursor={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </Chart.Body>
    </section>
  );
};

export default Price;
