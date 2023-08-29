import { useSelector } from 'react-redux';

import { useFetchGrowthEconomics } from 'hooks';
import { growthEconomicsSelector } from 'redux/selectors';

import { EconomicsLabelsEnum } from './enum';
import styles from './styles.module.scss';
import { EconomicsType } from './types';

export const EconomicsCard = () => {
  const { developerRewards, applicationsDeployed, feesCaptured } = useSelector(
    growthEconomicsSelector
  );

  const economics: EconomicsType[] = [
    {
      label: EconomicsLabelsEnum.DeveloperRewards,
      value: `${developerRewards} EGLD`
    },
    {
      label: EconomicsLabelsEnum.FeesCaptured,
      value: `${feesCaptured} EGLD`
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
