import React from 'react';
import BigNumber from 'bignumber.js';

import { Denominate, FormatUSD, Chart } from 'components';
import { ChartConfigType } from 'components/Chart/helpers/types';
import { DECIMALS } from 'config';
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

  console.log('--bNtotalLocked.toString(10)', bNtotalLocked.toString(10));

  return (
    <>
      <div className='staking-details-center'>
        <h5 className='mb-1'>
          {bNtotalLocked.isEqualTo(0) ? 'No staking' : 'Total Staked'}
        </h5>
        <h6 className='mb-1'>
          <Denominate value={bNtotalLocked.toString(10)} decimals={2} />
        </h6>
        <p className='text-neutral-400 small mb-0'>
          <FormatUSD
            amount={bNtotalLocked.toString(10)}
            decimals={DECIMALS}
            digits={2}
          />
        </p>
      </div>
      <Chart.Donut config={config} />
    </>
  );
};
