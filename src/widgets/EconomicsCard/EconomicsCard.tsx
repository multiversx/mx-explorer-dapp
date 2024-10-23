import { useSelector } from 'react-redux';

import { useFetchGrowthEconomics } from 'hooks';
import {
  activeNetworkSelector,
  growthEconomicsSelector
} from 'redux/selectors';
import { EconomicsLabelsEnum, StatisticType } from 'types';

export const EconomicsCard = () => {
  const { developerRewards, applicationsDeployed, feesCaptured } = useSelector(
    growthEconomicsSelector
  );
  const { egldLabel } = useSelector(activeNetworkSelector);

  const economics: StatisticType[] = [
    {
      label: EconomicsLabelsEnum.DeveloperRewards,
      value: `${developerRewards} ${egldLabel}`
    },
    {
      label: EconomicsLabelsEnum.FeesCaptured,
      value: `${feesCaptured} ${egldLabel}`
    },
    {
      label: EconomicsLabelsEnum.ApplicationsDeployed,
      value: applicationsDeployed
    }
  ];

  useFetchGrowthEconomics();

  return (
    <div className='economics-card'>
      {economics.map((economic) => (
        <div key={economic.label} className='economic'>
          <div className='label'>{economic.label}</div>
          <div className='value'>{economic.value}</div>
        </div>
      ))}
    </div>
  );
};
