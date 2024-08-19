import { useSelector } from 'react-redux';

import { FormatAmount, FormatUSD, Chart } from 'components';
import { ChartConfigType } from 'components/Chart/helpers/types';
import { DECIMALS } from 'config';
import { accountStakingSelector } from 'redux/selectors';

import { prepareChartData } from './helpers/prepareChartData';

export const DonutChart = () => {
  const stakingDetails = useSelector(accountStakingSelector);
  const chartData = prepareChartData({ stakingDetails });
  const { totalLocked, showStakingDetails } = stakingDetails;

  const config: ChartConfigType[] = [
    {
      id: 'stake',
      label: 'stake',
      data: chartData
    }
  ];

  return (
    <>
      <div className='staking-details-center'>
        <h5 className='mb-1'>
          {showStakingDetails ? 'Total Locked' : 'No staking'}
        </h5>
        {showStakingDetails && (
          <>
            <h6 className='mb-1'>
              <FormatAmount value={totalLocked} showUsdValue={false} />
            </h6>
            <div className='text-neutral-400 small mb-0'>
              <FormatUSD
                value={totalLocked}
                decimals={DECIMALS}
                showPrefix={false}
              />
            </div>
          </>
        )}
      </div>
      <Chart.Donut config={config} />
    </>
  );
};
