import React, { useState } from 'react';
import moment from 'moment';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer } from 'recharts';

import { ChartProps } from './helpers/types';
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
  tooltip,
  hasOnlyStartEndTick,
}: ChartProps) => {
  const [focusBar, setFocusBar] = useState<any>(null);

  const chartData = getChartMergedData({ config, data, filter, category });

  const docStyle = window.getComputedStyle(document.documentElement);
  const primaryColor = docStyle.getPropertyValue('--primary');

  return (
    <div
      className={`chart-bar mb-n3 ${size ? `chart-bar-${size}` : ''} ${
        hasOnlyStartEndTick ? 'has-only-start-end-tick' : ''
      }`}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
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
            tickFormatter={(tick) => moment(tick).format(dateFormat ?? 'D MMM YYYY')}
            strokeWidth={0.3}
            {...(hasOnlyStartEndTick ? { tick: <StartEndTick dateformat={dateFormat} /> } : {})}
            {...(hasOnlyStartEndTick ? { interval: 0 } : {})}
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
              {chartData.map((entry: any, index: number) => (
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
          <Tooltip
            content={(props) => <CustomTooltip {...props} currency={currency} {...tooltip} />}
            cursor={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartBar;
