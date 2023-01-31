import React, { Fragment } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts';

import type { ChartAreaPropsType } from './types';

import styles from './styles.module.scss';
import moment from 'moment';

const CustomTooltip = (props: any) => {
  const { payload, active } = props;

  if (!payload || !active) {
    return null;
  }

  const labels: any = {
    total: 'Transactions',
    contractValue: 'Smart Contracts',
    transactionValue: 'Standard'
  };

  const [item] = payload;
  const total = {
    color: 'white',
    dataKey: 'total',
    value: payload.reduce((total: number, item: any) => total + item.value, 0)
  };

  const items = [total].concat(payload);
  const date = item
    ? moment.unix(item.payload.timestamp).format('ddd, MMM DD, YYYY')
    : null;

  return (
    <div className={styles.tooltip}>
      <div className={styles.date}>{date}</div>

      <div className={styles.items}>
        {items.map((item: any) => (
          <div key={item.value} className={styles.item}>
            <span className={styles.label}>{labels[item.dataKey]}</span>

            <span style={{ color: item.color }}>
              {item.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ChartArea = (props: ChartAreaPropsType) => {
  const { className, data, keys } = props;

  const colors = ['teal', 'purple'].map((color) =>
    getComputedStyle(document.documentElement)
      .getPropertyValue(`--${color}`)
      .trim()
  );

  return (
    <ResponsiveContainer height={150} width='100%' className={className}>
      <AreaChart data={data} margin={{ left: 0, right: 0 }}>
        {keys.map((key, index) => (
          <Fragment key={key}>
            <defs>
              <linearGradient
                id={`${key}-gradient`}
                x1='0'
                y1='0'
                x2='0'
                y2='1'
              >
                <stop offset='0%' stopColor={colors[index]} stopOpacity={0.5} />
                <stop
                  offset='100%'
                  stopColor={colors[index]}
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>

            <Area
              type='monotone'
              dataKey={key}
              stroke={colors[index]}
              fill={`url(#${key}-gradient)`}
              activeDot={{ stroke: colors[index], fill: colors[index] }}
            />
          </Fragment>
        ))}

        <Tooltip
          cursor={false}
          content={(props) => <CustomTooltip {...props} />}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
