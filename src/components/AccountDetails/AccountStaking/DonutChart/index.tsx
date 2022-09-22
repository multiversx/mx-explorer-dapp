import React, { useState } from 'react';
import BigNumber from 'bignumber.js';
import { PieChart, Pie, Sector, ResponsiveContainer, Cell } from 'recharts';
import getProviderColor from './helpers/getProviderColor';
import prepareChartData from './helpers/prepareChartData';
import { StakingDetailsType } from 'helpers/useFetchStakingDetails';
import { ProvidersDetailsType } from 'helpers/useFetchProvidersDetails';
import { Denominate, UsdValue } from 'sharedComponents';
import { useGlobalState } from 'context';
import { usdValue } from 'helpers';

const RenderActiveShape = (props: any) => {
  const {
    activeNetwork: { erdLabel },
    usd,
  } = useGlobalState();

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
        fontSize={10}
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
        {payload.displayValue ?? new BigNumber(value).toFormat()} {erdLabel}
      </text>
      {usd && (
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={28}
          textAnchor={textAnchor}
          fill={secondaryColor}
          fontSize={10}
        >
          {usdValue({ amount: payload.displayValue ?? value, usd, showPrefix: true })}
        </text>
      )}
    </g>
  );
};

const DonutChart = ({
  stakingDetails,
  providersDetails,
}: {
  stakingDetails: StakingDetailsType;
  providersDetails: ProvidersDetailsType;
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const docStyle = window.getComputedStyle(document.documentElement);
  const cardBgColor = docStyle.getPropertyValue('--card-bg');
  const mutedColor = docStyle.getPropertyValue('--muted');
  const chartData = prepareChartData({ stakingDetails, providersDetails });

  const { bNtotalLocked } = stakingDetails;

  return (
    <>
      <div className="staking-details-center">
        <h5 className="mb-1 h6">{bNtotalLocked.isEqualTo(0) ? 'No staking' : 'Total Staked'}</h5>
        <h6 className="mb-1 h5">
          <Denominate value={bNtotalLocked.toString(10)} decimals={2} />
        </h6>
        <p className="text-secondary small mb-0">
          <UsdValue input={bNtotalLocked.toString(10)} showPrefix />
        </p>
      </div>
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
            {chartData.map((entry, index) => (
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
    </>
  );
};

export default DonutChart;
