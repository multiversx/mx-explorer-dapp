import React, { useMemo, useState } from 'react';
import moment from 'moment';

import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Area,
  AreaChart,
  Tooltip,
  ComposedChart,
  Bar,
  Cell
} from 'recharts';

import { CustomTooltip } from './helpers/CustomTooltip';
import { formatYAxis } from './helpers/formatYAxis';
import { getChartMergedData } from './helpers/getChartMergedData';
import { StartEndTick } from './helpers/StartEndTick';
import {
  BiAxialChartProps,
  ChartProps,
  MergedChartDataType
} from './helpers/types';
import { useBiAxialChartData } from './hooks/useBiAxialChartData';

export const ComposedChartPoC = ({
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
  const [focusBar, setFocusBar] = useState<any>(null);

  const { secondSeriesData, domain, getChartData } = useBiAxialChartData({
    config,
    data,
    filter,
    category
  });

  const chartData = getChartData();

  const docStyle = window.getComputedStyle(document.documentElement);
  const mutedColor = docStyle.getPropertyValue('--muted');
  const primaryColor = docStyle.getPropertyValue('--primary');

  return (
    <div
      className={`chart-area mb-n3 ${size ? `chart-area-${size}` : ''} ${
        hasOnlyStartEndTick ? 'has-only-start-end-tick' : ''
      }`}
    >
      <ResponsiveContainer width='100%' height='100%'>
        <ComposedChart
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
              <stop offset='5%' stopColor={primaryColor} stopOpacity={0.25} />
              <stop offset='35%' stopColor={primaryColor} stopOpacity={0.4} />
              <stop offset='95%' stopColor={primaryColor} stopOpacity={0} />
            </linearGradient>
            {secondSeriesData.map((chartConfig) => {
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
            domain={chartData.map((x) => x.timestamp)}
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
            {...(chartData.length > 3 ? { scale: 'time' } : {})}
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
            tickCount={5}
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
            tickCount={5}
          />
          <Area
            type='monotone'
            yAxisId='left-axis'
            dataKey={config.firstSeriesConfig.id}
            stroke={config.firstSeriesConfig.stroke ?? primaryColor}
            {...(config.firstSeriesConfig.gradient
              ? { fill: `url(#${config.firstSeriesConfig.gradient})` }
              : { fill: 'url(#transparent)' })}
            {...(config.firstSeriesConfig.strokeDasharray
              ? { strokeDasharray: config.firstSeriesConfig.strokeDasharray }
              : {})}
            key={config.firstSeriesConfig.id}
            strokeWidth={1.5}
          />
          <Area
            type='monotone'
            yAxisId='right-axis'
            dataKey={config.secondSeriesConfig.id}
            stroke={config.secondSeriesConfig.stroke ?? primaryColor}
            {...(config.secondSeriesConfig.gradient
              ? { fill: `url(#${config.secondSeriesConfig.gradient})` }
              : { fill: 'url(#transparent)' })}
            {...(config.secondSeriesConfig.strokeDasharray
              ? { strokeDasharray: config.secondSeriesConfig.strokeDasharray }
              : {})}
            key={config.secondSeriesConfig.id}
            strokeWidth={1.5}
          />
          {/*<Bar*/}
          {/*  yAxisId='right-axis'*/}
          {/*  dataKey={config.secondSeriesConfig.id}*/}
          {/*  key={config.secondSeriesConfig.id}*/}
          {/*  {...(config.secondSeriesConfig.gradient*/}
          {/*    ? { fill: `url(#${config.secondSeriesConfig.gradient})` }*/}
          {/*    : { fill: 'url(#transparent)' })}*/}
          {/*  {...(config.secondSeriesConfig.stroke*/}
          {/*    ? { stroke: config.secondSeriesConfig.stroke }*/}
          {/*    : {})}*/}
          {/*  {...(config.secondSeriesConfig.fill*/}
          {/*    ? { fill: config.secondSeriesConfig.fill }*/}
          {/*    : {})}*/}
          {/*  {...(config.secondSeriesConfig.strokeDasharray*/}
          {/*    ? { strokeDasharray: config.secondSeriesConfig.strokeDasharray }*/}
          {/*    : {})}*/}
          {/*>*/}
          {/*  {chartData.map((entry: any, index: number) => (*/}
          {/*    <Cell*/}
          {/*      fill={*/}
          {/*        focusBar === index*/}
          {/*          ? primaryColor*/}
          {/*          : config.secondSeriesConfig.fill*/}
          {/*          ? config.secondSeriesConfig.fill*/}
          {/*          : primaryColor*/}
          {/*      }*/}
          {/*      key={index}*/}
          {/*    />*/}
          {/*  ))}*/}
          {/*</Bar>*/}
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
              stroke: mutedColor
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
