import classNames from 'classnames';
import { useSelector } from 'react-redux';

import { FormatEGLD } from 'components';
import { useFetchGrowthStaking } from 'hooks';
import { growthStakingSelector } from 'redux/selectors';
import {
  StatisticType,
  StakingStatisticsLabelEnum,
  WithClassnameType
} from 'types';

export const HeroStaking = ({ className }: WithClassnameType) => {
  const { stakingPercentage, totalStaked, averageAPR, usersStaking } =
    useSelector(growthStakingSelector);

  const statistics: StatisticType[] = [
    {
      label: StakingStatisticsLabelEnum.TotalStaked,
      value: <FormatEGLD value={totalStaked} showLabel />,
      detail: stakingPercentage
    },
    {
      label: StakingStatisticsLabelEnum.UsersStaking,
      value: usersStaking
    },
    {
      label: StakingStatisticsLabelEnum.AverageAPR,
      value: averageAPR
    }
  ];

  useFetchGrowthStaking();

  return (
    <div className={classNames(className, 'card hero-staking h-100')}>
      <div className='card-body d-flex flex-column gap-2 justify-content-between'>
        {statistics.map((statistic, i) => (
          <div className='d-flex flex-column' key={i}>
            {statistic.label && (
              <p className='text-neutral-400 mb-0 stats-card-title'>
                {statistic.label}
              </p>
            )}
            {statistic.value && (
              <h2 className='stats-card-value mb-0 text-primary'>
                {statistic.value}{' '}
                {statistic.detail && (
                  <span className='text-primary-200'>({statistic.detail})</span>
                )}
              </h2>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
