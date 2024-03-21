import BigNumber from 'bignumber.js';

import { FormatAmount, FormatUSD, Chart } from 'components';
import { ChartConfigType } from 'components/Chart/helpers/types';
import { ProviderType } from 'types';
import { AccountStakingSliceType } from 'types/account.types';

import { prepareChartData } from './helpers/prepareChartData';

export const DonutChart = ({
  stakingDetails,
  providers
}: {
  stakingDetails: AccountStakingSliceType;
  providers?: ProviderType[];
}) => {
  const chartData = providers
    ? prepareChartData({ stakingDetails, providers })
    : [];
  const { totalLocked } = stakingDetails;
  const bNtotalLocked = new BigNumber(totalLocked);

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
          {bNtotalLocked.isEqualTo(0) ? 'No staking' : 'Total Staked'}
        </h5>
        <h6 className='mb-1'>
          <FormatAmount value={bNtotalLocked.toString(10)} digits={2} />
        </h6>
        <div className='text-neutral-400 small mb-0'>
          <FormatUSD
            value={bNtotalLocked.toString(10)}
            digits={2}
            showPrefix={false}
          />
        </div>
      </div>
      <Chart.Donut config={config} />
    </>
  );
};
