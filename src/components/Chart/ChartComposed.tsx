import React, { useState } from 'react';
import moment from 'moment';
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Area,
  Tooltip,
  ComposedChart,
  CartesianGrid,
  Legend
} from 'recharts';
import { DataKey } from 'recharts/types/util/types';
import { CustomTooltip } from './helpers/CustomTooltip';
import { formatYAxis } from './helpers/formatYAxis';
import { StartEndTick } from './helpers/StartEndTick';
import { BiAxialChartProps } from './helpers/types';
import { useBiAxialChartData } from './hooks/useBiAxialChartData';

export const ChartComposed = ({
  config,
  data,
  dateFormat,
  filter,
  category,
  currency,
  percentageMultiplier,
  denomination,
  size,
  tooltip,
  hasOnlyStartEndTick
}: BiAxialChartProps) => {
  const [hoveredSeries, setHoveredSeries] = useState<string>();
  const [hiddenSeries, setHiddenSeries] = useState<Record<string, string>>();

  const { getChartData } = useBiAxialChartData({
    config,
    data,
    filter,
    category
  });

  const chartData = getChartData();

  const [neutral800, teal, violet400, muted, primary] = [
    'neutral-800',
    'teal',
    'violet-400',
    'muted',
    'primary'
  ].map((color) =>
    getComputedStyle(document.documentElement)
      .getPropertyValue(`--${color}`)
      .trim()
  );

  const onLegendMouseEnter = (e: any) => {
    const { dataKey } = e;
    setHoveredSeries(dataKey);
  };
  const onLegendMouseLeave = (e: any) => {
    setHoveredSeries('');
  };

  const onLegendClick = (e: any) => {
    const { dataKey } = e;

    const modifiedSeries = { ...hiddenSeries };
    modifiedSeries[dataKey] =
      modifiedSeries[dataKey] === dataKey ? undefined : dataKey;

    setHiddenSeries(modifiedSeries);
  };

  return (
    <div
      className={`${size ? `chart-area-${size}` : ''} ${
        hasOnlyStartEndTick ? 'has-only-start-end-tick' : ''
      }`}
    >
      <ResponsiveContainer width='100%' height={448}>
        <ComposedChart data={chartData}>
          <defs>
            <linearGradient id='transparent' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='100%' stopColor='transparent' stopOpacity={0} />
            </linearGradient>
          </defs>
          <defs>
            <linearGradient
              id='firstSeriesGradientId'
              x1='0'
              y1='0'
              x2='0'
              y2='1'
            >
              <stop offset='5%' stopColor={violet400} stopOpacity={0.15} />
              <stop offset='95%' stopColor={violet400} stopOpacity={0} />
            </linearGradient>
          </defs>
          <defs>
            <linearGradient
              id='secondSeriesGradientId'
              x1='0'
              y1='0'
              x2='0'
              y2='1'
            >
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
            domain={chartData.map((x) => x.timestamp)}
            tickFormatter={(tick) =>
              moment
                .unix(tick)
                .utc()
                .format(dateFormat ?? 'D MMM')
            }
            strokeWidth={0.3}
            {...(hasOnlyStartEndTick
              ? { tick: <StartEndTick dateformat={dateFormat} /> }
              : {})}
            {...(hasOnlyStartEndTick ? { interval: 0 } : {})}
            tickMargin={15}
          />

          <YAxis
            yAxisId='left-axis'
            orientation='left'
            tickFormatter={(tick) =>
              formatYAxis({
                tick,
                currency,
                percentageMultiplier,
                denomination
              })
            }
            axisLine={false}
            tickLine={false}
            tickCount={10}
            stroke={config.firstSeriesConfig.stroke}
            dx={-20}
          />
          <YAxis
            yAxisId='right-axis'
            orientation='right'
            tickFormatter={(tick) =>
              formatYAxis({
                tick,
                currency,
                percentageMultiplier,
                denomination
              })
            }
            axisLine={false}
            tickLine={false}
            tickCount={10}
            stroke={config.secondSeriesConfig.stroke}
            dx={20}
          />
          <Area
            type='monotone'
            yAxisId='left-axis'
            dataKey={config.firstSeriesConfig.id}
            stroke={config.firstSeriesConfig.stroke ?? primary}
            {...(config.firstSeriesConfig.gradient
              ? { fill: `url(#${config.firstSeriesConfig.gradient})` }
              : { fill: 'url(#transparent)' })}
            {...(config.firstSeriesConfig.strokeDasharray
              ? { strokeDasharray: config.firstSeriesConfig.strokeDasharray }
              : {})}
            key={config.firstSeriesConfig.id}
            strokeWidth={1.5}
            activeDot={{
              stroke: violet400,
              fill: violet400
            }}
            opacity={hoveredSeries === config.firstSeriesConfig.label ? 0.2 : 1}
            visibility={
              hiddenSeries &&
              hiddenSeries[config.firstSeriesConfig.label ?? ''] ===
                config.firstSeriesConfig.label
                ? 'hidden'
                : 'visible'
            }
          />
          <Area
            type='monotone'
            yAxisId='right-axis'
            dataKey={config.secondSeriesConfig.id}
            stroke={config.secondSeriesConfig.stroke ?? primary}
            {...(config.secondSeriesConfig.gradient
              ? { fill: `url(#${config.secondSeriesConfig.gradient})` }
              : { fill: 'url(#transparent)' })}
            {...(config.secondSeriesConfig.strokeDasharray
              ? {
                  strokeDasharray: config.secondSeriesConfig.strokeDasharray
                }
              : {})}
            key={config.secondSeriesConfig.id}
            strokeWidth={1.5}
            activeDot={{
              stroke: teal,
              fill: teal
            }}
            opacity={
              hoveredSeries === config.secondSeriesConfig.label ? 0.2 : 1
            }
            visibility={
              hiddenSeries &&
              hiddenSeries[config.secondSeriesConfig.label ?? ''] ===
                config.secondSeriesConfig.label
                ? 'hidden'
                : 'visible'
            }
          />

          <Tooltip
            content={(props) => (
              <CustomTooltip
                {...props}
                currency={currency}
                percentageMultiplier={percentageMultiplier}
                denomination={denomination}
                {...tooltip}
              />
            )}
            cursor={{
              strokeDasharray: '3 5',
              stroke: muted
            }}
          />

          <Legend
            verticalAlign='bottom'
            iconType='circle'
            onMouseEnter={onLegendMouseEnter}
            onMouseLeave={onLegendMouseLeave}
            onClick={onLegendClick}
            wrapperStyle={{
              cursor: 'pointer'
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
