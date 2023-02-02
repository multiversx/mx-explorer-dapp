import React, { Fragment } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts';

import { ChartTooltip } from 'components/Chart/ChartTooltip';
import { ChartConfigType } from 'components/Chart/helpers/types';

import { ChartAreaPropsType } from './types';

export const ChartArea = (props: ChartAreaPropsType) => {
  const { className, payload } = props;

  const sortedPayload = payload.sort(
    (alpha, beta) =>
      (beta.data ? beta.data.length : 0) - (alpha.data ? alpha.data.length : 0)
  );

  const seriesConfig: ChartConfigType[] = sortedPayload.map((item) => ({
    id: item.key,
    data: item.data,
    label: item.label
  }));

  const [alpha, beta] = payload;
  const [alphaKey, betaKey] = payload.map((item) => item.key);

  const data = alpha.data
    ? alpha.data.map((item, index) =>
        Object.assign(
          {},
          { timestamp: item.timestamp, [alphaKey]: item.value },
          beta.data && beta.data[index]
            ? { [betaKey]: beta.data[index].value }
            : {}
        )
      )
    : [];

  return (
    <ResponsiveContainer height={200} width='100%' className={className}>
      <AreaChart data={data} margin={{ left: 0, right: 0 }}>
        {sortedPayload.map((item, index) => (
          <Fragment key={item.key}>
            <defs>
              <linearGradient
                id={`${item.key}-gradient`}
                x1='0'
                y1='0'
                x2='0'
                y2='1'
              >
                <stop offset='0%' stopColor={item.color} stopOpacity={0.5} />
                <stop offset='100%' stopColor={item.color} stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <Area
              name={item.label}
              type='monotone'
              dataKey={item.key}
              stroke={item.color}
              fill={`url(#${item.key}-gradient)`}
              activeDot={{ stroke: item.color, fill: item.color }}
            />
          </Fragment>
        ))}

        <Tooltip
          cursor={false}
          content={(props) => {
            const totalValue = props.payload?.reduce((acc, curr) => {
              acc += Number(curr.value);
              return acc;
            }, 0);

            return (
              <ChartTooltip
                {...props}
                seriesConfig={seriesConfig}
                stacked={true}
                totalValueStacked={totalValue}
                stackedLabel='Transactions'
              />
            );
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
