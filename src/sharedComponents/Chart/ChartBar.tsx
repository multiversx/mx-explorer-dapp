import React, { useCallback, useState } from 'react';
import moment from 'moment';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer } from 'recharts';

import { ChartConfigType, CurrencyEnum, ChartSizeEnum } from './helpers/types';
import CustomTooltip from './helpers/CustomTooltip';
import formatYAxis from './helpers/formatYAxis';
import getChartMergedData from './helpers/getChartMergedData';
import StartEndTick from './helpers/StartEndTick';

const ChartBar = ({
  config,
  data,
  dateFormat,
  filter,
  category,
  currency,
  size,
}: {
  config: ChartConfigType[];
  data?: any;
  dateFormat?: string;
  filter?: string;
  category?: string;
  currency?: CurrencyEnum;
  size?: ChartSizeEnum;
}) => {
  const [focusBar, setFocusBar] = useState<any>(null);
  const format = useCallback(
    (data) =>
      data.map((item: any) => ({
        ...item,
        time: moment(item.time).format(dateFormat ?? 'D MMM YYYY'),
      })),
    [dateFormat]
  );
  const chartData = getChartMergedData({ config, data, filter, category });
  const formattedData = format(chartData);

  const docStyle = window.getComputedStyle(document.documentElement);
  const primaryColor = docStyle.getPropertyValue('--primary');

  return (
    <div className={`chart-bar mb-n3 ${size ? `chart-bar-${size}` : ''}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={formattedData}
          onMouseMove={(state) => {
            if (state.isTooltipActive) {
              setFocusBar(state.activeTooltipIndex);
            } else {
              setFocusBar(null);
            }
          }}
        >
          <defs>
            <linearGradient id="transparent" x1="0" y1="0" x2="0" y2="1">
              <stop offset="100%" stopColor="transparent" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="defaultGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={primaryColor} stopOpacity={0.25} />
              <stop offset="35%" stopColor={primaryColor} stopOpacity={0.4} />
              <stop offset="95%" stopColor={primaryColor} stopOpacity={0} />
            </linearGradient>
            {config.map((chartConfig) => {
              if (chartConfig.gradient) {
                return (
                  <linearGradient
                    key={chartConfig.gradient}
                    id={chartConfig.gradient}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor={`#${chartConfig.gradient}`} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={`#${chartConfig.gradient}`} stopOpacity={0} />
                  </linearGradient>
                );
              }

              return null;
            })}
          </defs>
          <XAxis
            dataKey="time"
            tickLine={false}
            tick={StartEndTick as any}
            interval={0}
            strokeWidth={0.3}
          />

          <YAxis
            orientation="right"
            tickFormatter={(tick) => formatYAxis(tick, currency)}
            axisLine={false}
            tickLine={false}
            tickCount={5}
          />

          {config.map((chartConfig) => (
            <Bar
              dataKey={chartConfig.id}
              key={chartConfig.id}
              {...(chartConfig.gradient
                ? { fill: `url(#${chartConfig.gradient})` }
                : { fill: 'url(#transparent)' })}
              {...(chartConfig.stroke ? { stroke: chartConfig.stroke } : {})}
              {...(chartConfig.fill ? { fill: chartConfig.fill } : {})}
              {...(chartConfig.strokeDasharray
                ? { strokeDasharray: chartConfig.strokeDasharray }
                : {})}
            >
              {formattedData.map((entry: any, index: string) => (
                <Cell
                  fill={
                    focusBar === index
                      ? primaryColor
                      : chartConfig.fill
                      ? chartConfig.fill
                      : primaryColor
                  }
                  key={index}
                />
              ))}
            </Bar>
          ))}
          <Tooltip content={CustomTooltip} cursor={false} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartBar;
