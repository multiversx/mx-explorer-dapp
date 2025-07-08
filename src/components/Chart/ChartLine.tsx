import moment from 'moment';
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Line,
  LineChart,
  Tooltip,
  CartesianGrid
} from 'recharts';

import { getColors } from 'helpers';
import { ChartTooltip } from './ChartTooltip';
import { formatYAxis } from './helpers/formatYAxis';
import { getChartMergedData } from './helpers/getChartMergedData';
import { StartEndTick } from './helpers/StartEndTick';
import { ChartProps } from './helpers/types';

export const ChartLine = ({
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

  const [neutral800, muted, primary] = getColors([
    'neutral-800',
    'muted',
    'primary'
  ]);

  if (!seriesConfig) {
    return null;
  }

  return (
    <div
      className={`mb-n3 ${size ? `chart-line-${size}` : ''} ${
        hasOnlyStartEndTick ? 'has-only-start-end-tick' : ''
      }`}
    >
      <ResponsiveContainer width='100%' height={448}>
        <LineChart data={chartData}>
          <defs>
            <linearGradient id='transparent' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='100%' stopColor='transparent' stopOpacity={0} />
            </linearGradient>
          </defs>
          <defs>
            <linearGradient id='defaultGradient' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor={primary} stopOpacity={0.15} />
              <stop offset='95%' stopColor={primary} stopOpacity={0} />
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

          <Line
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
              stroke: primary,
              fill: primary
            }}
          />

          <Tooltip
            content={(props) => (
              <ChartTooltip
                {...props}
                seriesConfig={[seriesConfig]}
                dateFormat={tooltip?.dateFormat}
                color={primary}
              />
            )}
            cursor={{
              strokeDasharray: '3 5',
              stroke: muted
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
