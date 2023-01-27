import React, { useEffect, useState } from 'react';
import { Area, Tooltip, ResponsiveContainer, AreaChart } from 'recharts';
import Select from 'react-select';
import axios from 'axios';

import styles from './styles.module.scss';

const CustomTooltip = (props: any) => {
  const { payload, active } = props;

  if (!payload || !active) {
    return null;
  }

  return (
    <div className={styles.tooltip}>
      {payload.map((item: any) => (
        <div key={item.value}>
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
            minimumFractionDigits: 0
          }).format(item.value)}
        </div>
      ))}
    </div>
  );
};

export const DelegationChart = () => {
  const [temp, setTemp] = useState<any>();
  const [data, setData] = useState<any>();

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(
        'https://tools.multiversx.com/growth-api/explorer/widgets/staking'
      );

      setTemp(data);
      setData(data['totalStakedAll']);
    };

    fetchData();
  }, []);

  const filters = [
    { label: '7d', key: 'totalStaked7d' },
    { label: '30d', key: 'totalStaked30d' },
    { label: 'All', key: 'totalStakedAll' }
  ];

  if (!temp) {
    return null;
  }

  return (
    <div className={styles.chart}>
      <div className={styles.wrapper}>
        <div className={styles.left}>
          <div className={styles.label}>Total Staked</div>
          <div className={styles.price}>
            15,286,612 EGLD <span>(63%)</span>
          </div>
        </div>

        <div className={styles.right}>
          <Select
            options={filters}
            isSearchable={false}
            defaultValue={filters[0]}
            className='styled-select'
            classNamePrefix='styled-select'
          />
        </div>
      </div>

      <ResponsiveContainer
        height={75}
        width='100%'
        className={styles.container}
      >
        <AreaChart data={data} margin={{ left: 0, right: 0 }}>
          <defs>
            <linearGradient id='colorPv' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor='#23f7dd' stopOpacity={0.15} />
              <stop offset='95%' stopColor='#23f7dd' stopOpacity={0} />
            </linearGradient>
          </defs>

          <Area
            type='monotone'
            dataKey='value'
            stroke='#23f7dd'
            fillOpacity={1}
            fill='url(#colorPv)'
          />

          <Tooltip content={CustomTooltip} cursor={false} />
        </AreaChart>
      </ResponsiveContainer>

      <div className={styles.statistics}>
        <div className={styles.statistic}>
          <div className={styles.label}>Circulating Supply</div>
          <div className={styles.value}>24,323,731 EGLD</div>
        </div>

        <div className={styles.statistic}>
          <div className={styles.label}>Users Staking</div>
          <div className={styles.value}>135,795</div>
        </div>

        <div className={styles.statistic}>
          <div className={styles.label}>Average APR</div>
          <div className={styles.value}>8.84%</div>
        </div>
      </div>
    </div>
  );
};
