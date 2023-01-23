import React, { useState } from 'react';
import BigNumber from 'bignumber.js';
import { ResponsiveContainer, PieChart, Pie, Sector, Cell } from 'recharts';

import { ChartProps } from './helpers/types';
import { getProviderColor } from './helpers/getEntryColor';
import { usdValue } from 'helpers';

import { useSelector } from 'react-redux';
import { economicsSelector, activeNetworkSelector } from 'redux/selectors';

const RenderActiveShape = (props: any) => {
  const { egldLabel } = useSelector(activeNetworkSelector);
  const { economicsFetched, price } = useSelector(economicsSelector);

  const RADIAN = Math.PI / 180;

  const docStyle = window.getComputedStyle(document.documentElement);
  const secondaryColor = docStyle.getPropertyValue('--secondary');
  const bodyColor = docStyle.getPropertyValue('--body');
  const cardBgColor = docStyle.getPropertyValue('--card-bg');

  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 4) * cos;
  const sy = cy + (outerRadius + 4) * sin;
  const mx = cx + (outerRadius + 2) * cos;
  const my = cy + (outerRadius + 32) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 10;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        strokeWidth={percent === 1 ? 0 : 3}
        stroke={cardBgColor}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 2}
        outerRadius={outerRadius + 4}
        fill={fill}
        stroke={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill={bodyColor}
        fontSize={payload.name === 'MultiversX Legacy Delegation' ? 8.5 : 10}
      >
        {payload.name}
      </text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={15}
        textAnchor={textAnchor}
        fill={bodyColor}
        fontSize={12}
      >
        {payload.displayValue ?? new BigNumber(value).toFormat()} {egldLabel}
      </text>
      {economicsFetched && (
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={28}
          textAnchor={textAnchor}
          fill={secondaryColor}
          fontSize={10}
        >
          {usdValue({ amount: payload.displayValue ?? value, usd: price, showPrefix: true })}
        </text>
      )}
    </g>
  );
};

export const ChartDonut = ({ config }: ChartProps) => {
  const chartData = config[0].data;
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const docStyle = window.getComputedStyle(document.documentElement);
  const cardBgColor = docStyle.getPropertyValue('--card-bg');
  const mutedColor = docStyle.getPropertyValue('--muted');

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          activeIndex={activeIndex}
          activeShape={<RenderActiveShape />}
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={75}
          outerRadius={100}
          dataKey="value"
          onMouseEnter={onPieEnter}
          onClick={onPieEnter}
          strokeWidth={chartData.length > 1 ? 3 : 0}
          stroke={cardBgColor}
        >
          {chartData.map((entry: any, index: number) => (
            <Cell
              key={`cell-${index}`}
              fill={
                entry?.identifier
                  ? getProviderColor({
                      name: entry.identifier,
                      currentIndex: index,
                      total: chartData.length,
                    })
                  : mutedColor
              }
            />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};
