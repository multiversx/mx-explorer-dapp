import React from 'react';
import { useSelector } from 'react-redux';

import { growthEconomicsSelector } from 'redux/selectors';
import { useFetchGrowthEconomics } from 'hooks';

import { EconomicsLabelsEnum } from './enum';

import type { EconomicsType } from './types';

import styles from './styles.module.scss';

export const EconomicsCard = () => {
  const { developerRewards, applicationsDeployed, feesCaptured } = useSelector(
    growthEconomicsSelector
  );

  const economics: EconomicsType[] = [
    {
      label: EconomicsLabelsEnum.DeveloperRewards,
      value: developerRewards
    },
    {
      label: EconomicsLabelsEnum.FeesCaptured,
      value: feesCaptured
    },
    {
      label: EconomicsLabelsEnum.ApplicationsDeployed,
      value: applicationsDeployed
    }
  ];

  useFetchGrowthEconomics();

  return (
    <div className={styles.economics}>
      {economics.map((economic) => (
        <div key={economic.label} className={styles.economic}>
          <div className={styles.label}>{economic.label}</div>
          <div className={styles.value}>{economic.value}</div>
        </div>
      ))}
    </div>
  );
};
