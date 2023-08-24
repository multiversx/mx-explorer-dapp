import { Area, AreaChart, ResponsiveContainer, Tooltip, YAxis } from 'recharts';

import styles from './styles.module.scss';
import { ChartRootPropsType } from './types';

const CustomTooltip = (props: any) => {
  const { payload, active, formatter } = props;

  if (!payload || !active) {
    return null;
  }

  return payload.map((item: any) => (
    <div
      className={styles.tooltip}
      style={{ color: item.color }}
      key={item.value}
    >
      <span className={styles.dot} style={{ background: item.color }} />
      <span className={styles.background} style={{ background: item.color }} />
      <span className={styles.border} style={{ borderColor: item.color }} />

      {formatter(item)}
    </div>
  ));
};

export const ChartRoot = (props: ChartRootPropsType) => {
  const { className, data, height, color, identifier, tooltipFormatter } =
    props;

  return (
    <ResponsiveContainer height={height} width='100%' className={className}>
      <AreaChart data={data} margin={{ left: 0, right: 0, top: 5, bottom: 5 }}>
        <defs>
          <linearGradient id={identifier} x1='0' y1='0' x2='0' y2='1'>
            <stop offset='5%' stopColor={color} stopOpacity={0.15} />
            <stop offset='95%' stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>

        <Area
          type='monotone'
          dataKey='value'
          stroke={color}
          fill={`url(#${identifier})`}
          activeDot={{ stroke: color, fill: color }}
        />

        <YAxis domain={['dataMin', 'dataMax']} hide={true} />

        <Tooltip
          cursor={false}
          content={(props) => (
            <CustomTooltip formatter={tooltipFormatter} {...props} />
          )}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
