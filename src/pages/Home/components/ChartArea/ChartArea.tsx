import { Fragment, useEffect, useState } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, Dot } from 'recharts';

import { ChartSimpleTooltip } from 'components/Chart/ChartSimpleTooltip';
import { ChartTooltip } from 'components/Chart/ChartTooltip';
import { ChartConfigType } from 'components/Chart/helpers/types';
import { getPrimaryColor } from 'helpers';

import { ChartAreaPropsType } from './types';

const CustomCursor = (props: any) => {
  const primary = getPrimaryColor();
  const { points, activeDotPos } = props;

  const startingPoint = points[0];
  const endingPoint = points[1];

  const [x1, y1] = [startingPoint.x, activeDotPos.y + 10]; // adding 10 to y to prevent cursor from overlapping with active dot
  const [x2, y2] = [endingPoint.x, endingPoint.y];

  return (
    <svg x1={x1} y1={y1} x2={x2} y2={y2}>
      <defs>
        <linearGradient
          id='gradient'
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor={primary} offset='0' />
          <stop stopColor='#A78BFA' offset='1' />
        </linearGradient>
      </defs>
      <line
        x1={x1}
        y1={y1 - 5}
        x2={x2}
        y2={y2}
        stroke='url(#gradient)'
        strokeWidth={1}
      />
    </svg>
  );
};

const CustomActiveDot = (props: any) => {
  const { cx, cy, setActiveDotPos } = props;

  useEffect(() => {
    setActiveDotPos({ x: cx, y: cy });
  }, []);

  return <Dot {...props} />;
};

export const ChartArea = (props: ChartAreaPropsType) => {
  const { className, payload, simpleTooltip = true } = props;
  const [activeDotPos, setActiveDotPos] = useState({ x: 0, y: 0 });

  const sortedPayload = payload.sort(
    (alpha, beta) =>
      (beta.data ? beta.data.length : 0) - (alpha.data ? alpha.data.length : 0)
  );

  const seriesConfig: ChartConfigType[] = sortedPayload.map((item) => ({
    id: item.key,
    data: item.data,
    label: item.label
  }));

  const [alpha, beta, gamma] = payload;
  const [alphaKey, betaKey, gammaKey] = payload.map((item) => item.key);

  const data = alpha.data
    ? alpha.data.map((item, index) => {
        return {
          timestamp: item.timestamp,
          [alphaKey]: item.value,
          ...(beta?.data && beta.data[index]
            ? { [betaKey]: beta.data[index].value }
            : {}),
          ...(gamma?.data && gamma.data[index]
            ? { [gammaKey]: gamma.data[index].value }
            : {})
        };
      })
    : [];

  return (
    <ResponsiveContainer
      height={props.height ?? 200}
      width='100%'
      className={className}
    >
      <AreaChart data={data} margin={{ left: 0, right: 0 }}>
        {sortedPayload.map((item) => (
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
                <stop offset='25%' stopColor={item.color} stopOpacity={0.25} />
                <stop offset='75%' stopColor={item.color} stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <Area
              name={item.label}
              type='monotone'
              dataKey={item.key}
              stroke={item.color}
              fill={`url(#${item.key}-gradient)`}
              activeDot={
                <CustomActiveDot
                  setActiveDotPos={setActiveDotPos}
                  stroke={item.color}
                  fill={item.color}
                />
              }
            />
          </Fragment>
        ))}

        <Tooltip
          cursor={
            simpleTooltip ? <CustomCursor activeDotPos={activeDotPos} /> : false
          }
          content={(props) => {
            return simpleTooltip ? (
              <ChartSimpleTooltip {...props} />
            ) : (
              <ChartTooltip {...props} seriesConfig={seriesConfig} />
            );
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
