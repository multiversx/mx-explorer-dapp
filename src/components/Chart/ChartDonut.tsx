import { useState, useCallback, useMemo, useRef } from 'react';
import BigNumber from 'bignumber.js';
import { useSelector } from 'react-redux';
import { ResponsiveContainer, PieChart, Pie, Sector, Cell } from 'recharts';

import { FormatUSD } from 'components';
import { usdValue } from 'helpers';

import { economicsSelector, activeNetworkSelector } from 'redux/selectors';
import { getProviderColor } from './helpers/getEntryColor';
import { ChartProps } from './helpers/types';

const RenderActiveShape = (props: any) => {
  const { egldLabel } = useSelector(activeNetworkSelector);
  const { isDataReady, unprocessed } = useSelector(economicsSelector);

  const RADIAN = Math.PI / 180;

  const docStyle = window.getComputedStyle(document.documentElement);
  const secondaryColor = docStyle.getPropertyValue('--neutral-400');
  const bodyColor = docStyle.getPropertyValue('--body-color');
  const cardBgColor = docStyle.getPropertyValue('--neutral-950');

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
    value
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
        cornerRadius={5}
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
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill='none'
        className='d-none d-md-block'
      />
      <circle
        cx={ex}
        cy={ey}
        r={2}
        fill={fill}
        stroke='none'
        className='d-none d-md-block'
      />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill={bodyColor}
        fontSize={payload.name === 'MultiversX Legacy Delegation' ? 8.5 : 10}
        className='d-none d-md-block'
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
        className='d-none d-md-block'
      >
        {payload.displayValue ?? new BigNumber(value).toFormat()} {egldLabel}
      </text>
      {isDataReady && (
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={28}
          textAnchor={textAnchor}
          fill={secondaryColor}
          fontSize={10}
          className='d-none d-md-block'
        >
          {usdValue({
            amount: payload.displayValue ?? value,
            usd: unprocessed.price,
            showPrefix: true
          })}
        </text>
      )}
    </g>
  );
};

export const ChartDonut = ({ config }: ChartProps) => {
  const { egldLabel } = useSelector(activeNetworkSelector);
  const { unprocessed } = useSelector(economicsSelector);
  const chartData = config[0].data;
  const previousActiveIndex = useRef<number | undefined>();
  const [activeIndex, setActiveIndex] = useState<number | undefined>(0);

  const onPieEnter = (_: any, index: number) => {
    previousActiveIndex.current = activeIndex;
    setActiveIndex(index);
  };

  const onPieLeave = useCallback(() => {
    if (activeIndex === previousActiveIndex.current) {
      return;
    }

    setActiveIndex(undefined);
  }, [activeIndex, previousActiveIndex.current]);

  const activeSector = useMemo(() => {
    if (activeIndex != null) {
      return chartData[activeIndex];
    }
    return null;
  }, [chartData, activeIndex]);

  const roundedChart = chartData.length > 10 ? false : true;
  const strokeWidth = chartData.length > 1 ? (roundedChart ? 3 : 1) : 0;

  const docStyle = window.getComputedStyle(document.documentElement);
  const cardBgColor = docStyle.getPropertyValue('--neutral-950');
  const mutedColor = docStyle.getPropertyValue('--muted');

  return (
    <>
      <ResponsiveContainer width='100%' height='100%'>
        <PieChart>
          <Pie
            activeIndex={activeIndex}
            activeShape={<RenderActiveShape />}
            data={chartData}
            cx='50%'
            cy='50%'
            innerRadius={75}
            outerRadius={100}
            cornerRadius={roundedChart ? 5 : undefined}
            dataKey='value'
            onMouseEnter={onPieEnter}
            onMouseLeave={onPieLeave}
            onClick={onPieEnter}
            strokeWidth={strokeWidth}
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
                        total: chartData.length
                      })
                    : mutedColor
                }
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {activeSector && unprocessed?.price && (
        <div className='card chart-tooltip d-flex d-md-none'>
          <div className='card-body p-3'>
            {activeSector?.name}: {activeSector?.value} {egldLabel}{' '}
            <span className='text-neutral-400'>
              <FormatUSD
                value={activeSector?.value}
                usd={unprocessed.price}
                showPrefix={false}
              />
            </span>
          </div>
        </div>
      )}
    </>
  );
};
