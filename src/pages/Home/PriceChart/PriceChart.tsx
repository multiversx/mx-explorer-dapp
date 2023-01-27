import React, { useEffect, useState } from 'react';
import { Area, Tooltip, ResponsiveContainer, AreaChart } from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUp } from '@fortawesome/pro-solid-svg-icons';
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
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
          }).format(item.value)}
        </div>
      ))}
    </div>
  );
};

export const PriceChart = () => {
  const [temp, setTemp] = useState<any>();
  const [data, setData] = useState<any>();

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(
        'https://tools.multiversx.com/growth-api/explorer/widgets/price'
      );

      setTemp(data);
      setData(data['priceAll']);
    };

    fetchData();
  }, []);

  const filters = [
    {
      label: '7d',
      key: 'price7d'
    },
    {
      label: '30d',
      key: 'price30d'
    },
    {
      label: 'All',
      key: 'priceAll'
    }
  ];

  if (!temp) {
    return null;
  }

  const price = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  }).format(temp.currentPrice);

  const marketCap = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  }).format(temp.marketCap);

  const volume24h = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  }).format(temp.volume24h);

  return (
    <div className={styles.chart}>
      <div className={styles.wrapper}>
        <div className={styles.left}>
          <div className={styles.label}>Current Price</div>
          <div className={styles.price}>{price}</div>

          <span className={styles.change}>
            <FontAwesomeIcon icon={faCircleUp} className={styles.icon} />
            <span className={styles.percentage}>4.5%</span>
          </span>
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

      <ResponsiveContainer height={75} width='100%'>
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
          <div className={styles.label}>Market Cap</div>
          <div className={styles.value}>{marketCap}</div>
        </div>

        <div className={styles.statistic}>
          <div className={styles.label}>24h Volume</div>
          <div className={styles.value}>{volume24h}</div>
        </div>
      </div>
    </div>
  );
};
