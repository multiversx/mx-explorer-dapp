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
import { AnalyticsChartTooltip } from './AnalyticsChartTooltip';
import { formatYAxis } from './helpers/formatYAxis';
import { StartEndTick } from './helpers/StartEndTick';
import { ChartComposedProps, ChartConfigType } from './helpers/types';
import { useChartComposedData } from './hooks/useChartComposedData';

export const ChartComposed = ({
  seriesConfig,
  size,
  dateFormat,
  hasOnlyStartEndTick,
  tooltip,
  showLegend
}: ChartComposedProps) => {
  const [hoveredSeries, setHoveredSeries] = useState<string>();
  const [hiddenSeries, setHiddenSeries] =
    useState<Record<string, string | undefined>>();

  const [white, neutral800, muted, primary, secondary] = [
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

  const { getChartData } = useChartComposedData({
    seriesConfig
  });

  const chartData = getChartData();

  const getSeriesVisibility = (series: ChartConfigType) => {
    return hiddenSeries && hiddenSeries[series.label ?? ''] === series.label
      ? 'hidden'
      : 'visible';
  };

  const getSeriesOpacity = (series: ChartConfigType) => {
    return hoveredSeries === series.label ? 0.3 : 1;
  };

  const getLegendPayload = () => {
    return seriesConfig.map((sc) => ({
      id: sc.id,
      style: {
        ...sc.legendStyle,
        color: sc.stroke
      },
      value: sc.label
    }));
  };

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
          const {
            id: dataKey,
            style: { color, ...styleRest }
          } = entry;
          const active = Boolean(hiddenSeries && hiddenSeries[dataKey]);
          const styles = {
            margin: 5,
            color: `${active ? secondary : color}`,
            borderColor: color,
            ...styleRest
          };

          return (
            <span
              key={dataKey}
              className='legend-item badge rounded-pill filter-badge'
              onMouseEnter={onLegendMouseEnter(dataKey)}
              onMouseLeave={onLegendMouseLeave}
              onClick={onLegendClick(dataKey)}
              style={styles}
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
          {seriesConfig.map((sc) => (
            <defs key={`gradient-${sc.id}`}>
              <linearGradient id={sc.gradient} x1='0' y1='0' x2='0' y2='1'>
                <stop
                  offset='5%'
                  stopColor={sc.gradientStopColor}
                  stopOpacity={0.15}
                />
                <stop
                  offset='95%'
                  stopColor={sc.gradientStopColor}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
          ))}

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

          {seriesConfig.map((sc) => (
            <React.Fragment key={`y-axis-chart-${sc.id}`}>
              <YAxis
                yAxisId={sc.yAxisConfig?.id}
                orientation={sc.yAxisConfig?.orientation ?? 'left'}
                tickFormatter={(tick) =>
                  formatYAxis({
                    tick,
                    currency: sc.yAxisConfig?.currency,
                    percentageMultiplier: sc.yAxisConfig?.percentageMultiplier,
                    decimals: sc.yAxisConfig?.decimals
                  })
                }
                axisLine={false}
                tickLine={false}
                tickCount={10}
                stroke={sc.stroke}
                dy={2}
              />
              <Area
                type='monotone'
                yAxisId={sc.yAxisConfig?.id}
                dataKey={sc.id}
                stroke={sc.stroke ?? primary}
                {...(sc.gradient
                  ? { fill: `url(#${sc.gradient})` }
                  : { fill: 'url(#transparent)' })}
                {...(sc.strokeDasharray
                  ? { strokeDasharray: sc.strokeDasharray }
                  : {})}
                strokeWidth={1.5}
                activeDot={{
                  stroke: sc.stroke,
                  fill: sc.stroke
                }}
                opacity={getSeriesOpacity(sc)}
                visibility={getSeriesVisibility(sc)}
              />
            </React.Fragment>
          ))}

          <Tooltip
            content={(props) => (
              <AnalyticsChartTooltip
                {...props}
                seriesConfig={seriesConfig}
                dateFormat={tooltip?.dateFormat}
              />
            )}
            cursor={{
              strokeDasharray: '3 5',
              stroke: muted
            }}
          />

          {showLegend && (
            <Legend
              verticalAlign='bottom'
              iconType='circle'
              wrapperStyle={{
                cursor: 'pointer',
                paddingTop: '1.5rem'
              }}
              payload={getLegendPayload()}
              content={renderCustomizedLegend}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
