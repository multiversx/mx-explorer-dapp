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
  Legend,
  Surface,
  Symbols
} from 'recharts';
import { Props } from 'recharts/types/component/DefaultLegendContent';
import { CustomTooltip } from './helpers/CustomTooltip';
import { formatYAxis } from './helpers/formatYAxis';
import { StartEndTick } from './helpers/StartEndTick';
import { BiAxialChartProps } from './helpers/types';
import { useBiAxialChartData } from './hooks/useBiAxialChartData';

export const ChartComposed = ({
  firstSeriesConfig,
  secondSeriesConfig,
  size,
  dateFormat,
  hasOnlyStartEndTick
}: BiAxialChartProps) => {
  const [hoveredSeries, setHoveredSeries] = useState<string>();
  const [hiddenSeries, setHiddenSeries] =
    useState<Record<string, string | undefined>>();

  const [white, neutral800, teal, violet400, muted, primary, secondary] = [
    'white',
    'neutral-800',
    'teal',
    'violet-400',
    'muted',
    'primary',
    'secondary'
  ].map((color) =>
    getComputedStyle(document.documentElement)
      .getPropertyValue(`--${color}`)
      .trim()
  );

  const { getChartData } = useBiAxialChartData({
    firstSeriesConfig,
    secondSeriesConfig
  });

  const chartData = getChartData();

  const firstSeriesVisibility =
    hiddenSeries &&
    hiddenSeries[firstSeriesConfig.label ?? ''] === firstSeriesConfig.label
      ? 'hidden'
      : 'visible';
  const firstSeriesOpacity =
    hoveredSeries === firstSeriesConfig.label ? 0.3 : 1;

  const secondSeriesVisibility =
    hiddenSeries &&
    hiddenSeries[secondSeriesConfig.label ?? ''] === secondSeriesConfig.label
      ? 'hidden'
      : 'visible';
  const secondSeriesOpacity =
    hoveredSeries === secondSeriesConfig.label ? 0.3 : 1;

  const onLegendMouseEnter = (dataKey: string) => () => {
    setHoveredSeries(dataKey);
  };
  const onLegendMouseLeave = () => {
    setHoveredSeries('');
  };

  const onLegendClick = (dataKey: string) => () => {
    const modifiedSeries = { ...hiddenSeries };
    modifiedSeries[dataKey] =
      modifiedSeries[dataKey] === dataKey ? undefined : dataKey;

    setHiddenSeries(modifiedSeries);
  };

  const renderCustomizedLegend = ({ payload }: Props) => {
    return (
      <div className='d-flex justify-content-center flex-wrap customized-legend'>
        {payload?.map((entry: any) => {
          const { id: dataKey, color } = entry;
          const active = Boolean(hiddenSeries && hiddenSeries[dataKey]);
          const style = {
            marginRight: 10,
            color: `${active ? secondary : color}`
          };
          const badgeOutlineColor =
            dataKey === firstSeriesConfig.id ? 'first' : 'second';

          return (
            <span
              key={dataKey}
              className={`legend-item badge rounded-pill filter-badge ${badgeOutlineColor}`}
              onMouseEnter={onLegendMouseEnter(dataKey)}
              onMouseLeave={onLegendMouseLeave}
              onClick={onLegendClick(dataKey)}
              style={style}
            >
              <Surface
                width={10}
                height={10}
                viewBox={{ x: 0, y: 0, width: 10, height: 10 }}
              >
                <Symbols
                  cx={5}
                  cy={5}
                  type='circle'
                  size={50}
                  fill={color}
                  stroke={color}
                />
                {active && (
                  <Symbols
                    cx={5}
                    cy={5}
                    type='circle'
                    size={25}
                    fill={white}
                    stroke={white}
                  />
                )}
              </Surface>
              <span className='mx-1'>{dataKey}</span>
            </span>
          );
        })}
      </div>
    );
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
                currency: firstSeriesConfig.yAxisConfig?.currency,
                percentageMultiplier:
                  firstSeriesConfig.yAxisConfig?.percentageMultiplier,
                decimals: firstSeriesConfig.yAxisConfig?.decimals
              })
            }
            axisLine={false}
            tickLine={false}
            tickCount={10}
            stroke={firstSeriesConfig.stroke}
          />
          <YAxis
            yAxisId='right-axis'
            orientation='right'
            tickFormatter={(tick) =>
              formatYAxis({
                tick,
                currency: secondSeriesConfig.yAxisConfig?.currency,
                percentageMultiplier:
                  secondSeriesConfig.yAxisConfig?.percentageMultiplier,
                decimals: secondSeriesConfig.yAxisConfig?.decimals
              })
            }
            axisLine={false}
            tickLine={false}
            tickCount={10}
            stroke={secondSeriesConfig.stroke}
          />
          <Area
            type='monotone'
            yAxisId='left-axis'
            dataKey={firstSeriesConfig.id}
            stroke={firstSeriesConfig.stroke ?? primary}
            {...(firstSeriesConfig.gradient
              ? { fill: `url(#${firstSeriesConfig.gradient})` }
              : { fill: 'url(#transparent)' })}
            {...(firstSeriesConfig.strokeDasharray
              ? { strokeDasharray: firstSeriesConfig.strokeDasharray }
              : {})}
            key={firstSeriesConfig.id}
            strokeWidth={1.5}
            activeDot={{
              stroke: violet400,
              fill: violet400
            }}
            opacity={firstSeriesOpacity}
            visibility={firstSeriesVisibility}
          />
          <Area
            type='monotone'
            yAxisId='right-axis'
            dataKey={secondSeriesConfig.id}
            stroke={secondSeriesConfig.stroke ?? primary}
            {...(secondSeriesConfig.gradient
              ? { fill: `url(#${secondSeriesConfig.gradient})` }
              : { fill: 'url(#transparent)' })}
            {...(secondSeriesConfig.strokeDasharray
              ? {
                  strokeDasharray: secondSeriesConfig.strokeDasharray
                }
              : {})}
            key={secondSeriesConfig.id}
            strokeWidth={1.5}
            activeDot={{
              stroke: teal,
              fill: teal
            }}
            opacity={secondSeriesOpacity}
            visibility={secondSeriesVisibility}
          />

          <Tooltip
            // content={(props) => (
            //   <CustomTooltip
            //     {...props}
            //     currency={currency}
            //     percentageMultiplier={percentageMultiplier}
            //     denomination={denomination}
            //     {...tooltip}
            //   />
            // )}
            cursor={{
              strokeDasharray: '3 5',
              stroke: muted
            }}
          />

          <Legend
            verticalAlign='bottom'
            iconType='circle'
            wrapperStyle={{
              cursor: 'pointer',
              position: 'relative'
            }}
            payload={[
              {
                id: firstSeriesConfig.id,
                color: firstSeriesConfig.stroke,
                value: firstSeriesConfig.label
              },
              {
                id: secondSeriesConfig.id,
                color: secondSeriesConfig.stroke,
                value: secondSeriesConfig.label
              }
            ]}
            content={renderCustomizedLegend}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
