import React from 'react';
import moment from 'moment';
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Area,
  AreaChart,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { AnalyticsChartTooltip } from './AnalyticsChartTooltip';
import { formatYAxis } from './helpers/formatYAxis';
import { getChartMergedData } from './helpers/getChartMergedData';
import { StartEndTick } from './helpers/StartEndTick';
import { ChartProps } from './helpers/types';

export const ChartAreaNew = ({
  config,
  data,
  dateFormat,
  filter,
  category,
  size,
  tooltip,
  hasOnlyStartEndTick
}: ChartProps) => {
  const chartData = getChartMergedData({ config, data, filter, category });
  const seriesConfig = config.length > 0 ? config[0] : null;
  const domain = [
    chartData[0].timestamp,
    chartData[chartData.length - 1].timestamp
  ];

  const [neutral800, teal, muted, primary] = [
    'neutral-800',
    'teal',
    'muted',
    'primary'
  ].map((color) =>
    getComputedStyle(document.documentElement)
      .getPropertyValue(`--${color}`)
      .trim()
  );

  if (!seriesConfig) {
    return null;
  }

  return (
    <div
      className={`mb-n3 ${size ? `chart-area-${size}` : ''} ${
        hasOnlyStartEndTick ? 'has-only-start-end-tick' : ''
      }`}
    >
      <ResponsiveContainer width='100%' height={448}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id='transparent' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='100%' stopColor='transparent' stopOpacity={0} />
            </linearGradient>
          </defs>
          <defs>
            <linearGradient id='defaultGradient' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor={teal} stopOpacity={0.15} />
              <stop offset='95%' stopColor={teal} stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid vertical={false} stroke={neutral800} opacity={0.8} />

          <XAxis
            minTickGap={40}
            tickCount={10}
            dataKey='timestamp'
            tickLine={false}
            domain={domain}
            tickFormatter={(tick) =>
              moment
                .unix(tick)
                .utc()
                .format(dateFormat ?? 'D MMM YYYY')
            }
            strokeWidth={0.3}
            {...(hasOnlyStartEndTick
              ? { tick: <StartEndTick dateformat={dateFormat} /> }
              : {})}
            {...(hasOnlyStartEndTick ? { interval: 0 } : {})}
            dy={15}
          />

          <YAxis
            orientation={seriesConfig.yAxisConfig?.orientation}
            tickFormatter={(tick) =>
              formatYAxis({
                tick,
                currency: seriesConfig.yAxisConfig?.currency,
                percentageMultiplier:
                  seriesConfig.yAxisConfig?.percentageMultiplier,
                decimals: seriesConfig.yAxisConfig?.decimals
              })
            }
            axisLine={false}
            tickLine={false}
            tickCount={5}
            stroke={seriesConfig.stroke}
            dy={2}
          />

          <Area
            type='monotone'
            dataKey={seriesConfig.id}
            stroke={seriesConfig.stroke ?? primary}
            {...(seriesConfig.gradient
              ? { fill: `url(#${seriesConfig.gradient})` }
              : { fill: 'url(#transparent)' })}
            {...(seriesConfig.strokeDasharray
              ? { strokeDasharray: seriesConfig.strokeDasharray }
              : {})}
            key={seriesConfig.id}
            strokeWidth={1.5}
            activeDot={{
              stroke: teal,
              fill: teal
            }}
          />

          <Tooltip
            content={(props) => (
              <AnalyticsChartTooltip
                {...props}
                seriesConfig={[seriesConfig]}
                dateFormat={tooltip?.dateFormat}
                color={teal}
              />
            )}
            cursor={{
              strokeDasharray: '3 5',
              stroke: muted
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
