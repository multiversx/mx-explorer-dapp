import { useState } from 'react';

import classNames from 'classnames';
import moment from 'moment';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ResponsiveContainer
} from 'recharts';

import { formatTimestamp, getColors } from 'helpers';

import { ChartTooltip } from './ChartTooltip';
import { formatYAxis } from './helpers/formatYAxis';
import { getChartMergedData } from './helpers/getChartMergedData';
import { StartEndTick } from './helpers/StartEndTick';
import { ChartProps } from './helpers/types';

export const ChartBar = ({
  config,
  data,
  dateFormat,
  filter,
  category,
  tooltip,
  width,
  height = 448,
  hasOnlyStartEndTick,
  hasAxis = true,
  hasGrid = true,
  hasDot = true,
  hasCursor = true,
  hasTooltip = true,
  className
}: ChartProps) => {
  const [focusBar, setFocusBar] = useState<any>(null);

  const chartData = getChartMergedData({ config, data, filter, category });
  const seriesConfig = config.length > 0 ? config[0] : null;
  const domain = [
    chartData[0].timestamp,
    chartData[chartData.length - 1].timestamp
  ];

  const [muted, primary] = getColors(['muted', 'primary']);

  if (!seriesConfig) {
    return null;
  }

  return (
    <div
      className={classNames('chart-bar mb-n3', className, {
        'has-only-start-end-tick': hasOnlyStartEndTick
      })}
    >
      <ResponsiveContainer width={width ?? '100%'} height={height}>
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
            <linearGradient id='transparent' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='100%' stopColor='transparent' stopOpacity={0} />
            </linearGradient>
            <linearGradient id='defaultGradient' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='0%' stopColor={primary} stopOpacity={0.25} />
              <stop offset='50%' stopColor={primary} stopOpacity={0.4} />
              <stop offset='100%' stopColor={primary} stopOpacity={0.9} />
            </linearGradient>
            {config.map((chartConfig) => {
              if (chartConfig.gradient) {
                return (
                  <linearGradient
                    key={chartConfig.gradient}
                    id={chartConfig.gradient}
                    x1='0'
                    y1='0'
                    x2='0'
                    y2='1'
                  >
                    <stop
                      offset='5%'
                      stopColor={`#${chartConfig.gradient}`}
                      stopOpacity={0.25}
                    />
                    <stop
                      offset='95%'
                      stopColor={`#${chartConfig.gradient}`}
                      stopOpacity={0}
                    />
                  </linearGradient>
                );
              }

              return null;
            })}
          </defs>
          <XAxis
            minTickGap={40}
            tickCount={10}
            dataKey='timestamp'
            tickLine={false}
            domain={domain}
            tickFormatter={(tick) =>
              moment(formatTimestamp(tick))
                .utc()
                .format(dateFormat ?? 'D MMM YYYY')
            }
            strokeWidth={0.3}
            {...(hasOnlyStartEndTick
              ? { tick: <StartEndTick dateformat={dateFormat} /> }
              : {})}
            {...(hasOnlyStartEndTick ? { interval: 0 } : {})}
            {...(chartData.length > 3 ? { scale: 'time' } : {})}
            hide={!hasAxis}
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
            domain={seriesConfig.yAxisConfig?.domain}
            axisLine={false}
            tickLine={false}
            tickCount={5}
            stroke={seriesConfig.stroke}
            hide={!hasAxis}
            dy={2}
          />

          {config.map((chartConfig) => {
            const chartGradient = chartConfig.gradient
              ? `url(#${chartConfig.gradient})`
              : chartConfig.fill ?? primary;
            return (
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
                {chartData.map((_entry: any, index: number) => (
                  <Cell
                    fill={focusBar === index ? primary : chartGradient}
                    key={index}
                  />
                ))}
              </Bar>
            );
          })}
          {hasTooltip && (
            <Tooltip
              content={(props) => (
                <ChartTooltip
                  {...props}
                  seriesConfig={[seriesConfig]}
                  dateFormat={tooltip?.dateFormat}
                  color={primary}
                />
              )}
              cursor={
                hasCursor
                  ? {
                      strokeDasharray: '3 5',
                      stroke: muted
                    }
                  : false
              }
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
