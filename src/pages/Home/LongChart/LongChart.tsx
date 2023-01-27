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
        <div key={item.value}>{item.value.toLocaleString()}</div>
      ))}
    </div>
  );
};

export const LongChart = () => {
  const [temp, setTemp] = useState<any>();
  const [data1, setData1] = useState<any>();
  const [data2, setData2] = useState<any>();

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(
        'https://tools.multiversx.com/growth-api/explorer/widgets/transactions'
      );

      setTemp(data);
      setData1(data['transactions30d']);
      setData2(data['scResults30d']);
    };

    fetchData();
  }, []);

  const statistics = [
    {
      label: 'Transactions',
      value: '1,086,076',
      color: '#ffffff'
    },
    {
      label: 'Smart Contracts',
      value: '798,074',
      color: '#23f7dd'
    },
    {
      label: 'Standard',
      value: '288,002',
      color: '#8B5CF6'
    }
  ];

  const filters = [
    {
      label: '7d',
      key: '7d'
    },
    {
      label: '30d',
      key: '30d'
    },
    {
      label: 'All',
      key: 'All'
    }
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.statistics}>
        {statistics.map((statistic) => (
          <div key={statistic.label} className={styles.statistic}>
            <div className={styles.label}>{statistic.label}</div>
            <div className={styles.value} style={{ color: statistic.color }}>
              {statistic.value}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.charts}>
        <div className={styles.filters}>
          <Select
            options={filters}
            isSearchable={false}
            defaultValue={filters[0]}
            className='styled-select'
            classNamePrefix='styled-select'
          />
        </div>

        <div className={styles.chart}>
          <ResponsiveContainer height={75} width='100%'>
            <AreaChart
              width={1050}
              data={data1}
              margin={{ left: 0, right: 0 }}
              syncId='syc'
            >
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
                fill='url(#colorPv)'
              />

              <Tooltip content={CustomTooltip} cursor={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chart}>
          <ResponsiveContainer height={75} width='100%'>
            <AreaChart
              width={1050}
              data={data2}
              margin={{ left: 0, right: 0 }}
              syncId='syc'
            >
              <defs>
                <linearGradient id='colorUv' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor='#8B5CF6' stopOpacity={0.15} />
                  <stop offset='95%' stopColor='#8B5CF6' stopOpacity={0} />
                </linearGradient>
              </defs>

              <Area
                type='monotone'
                dataKey='value'
                stroke='#8B5CF6'
                fillOpacity={1}
                fill='url(#colorUv)'
              />

              <Tooltip content={CustomTooltip} cursor={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
