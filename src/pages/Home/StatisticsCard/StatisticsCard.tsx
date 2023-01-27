import React from 'react';

import styles from './styles.module.scss';

export const StatisticsCard = () => {
  const statistics = [
    {
      label: 'Developer Rewards',
      value: '151,355 EGLD'
    },
    {
      label: 'Fees Captured',
      value: '42,086 EGLD'
    },
    {
      label: 'Applications Deployed',
      value: '249,987'
    }
  ];

  return (
    <div className={styles.statistics}>
      {statistics.map((statistic) => (
        <div key={statistic.label} className={styles.statistic}>
          <div className={styles.label}>{statistic.label}</div>
          <div className={styles.value}>{statistic.value}</div>
        </div>
      ))}
    </div>
  );
};
