import React from 'react';
import BigNumber from 'bignumber.js';

import { Denominate, UsdValue, Chart } from 'components';
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
        <h5 className='mb-1'>
          <Denominate value={bNtotalLocked.toString(10)} decimals={2} />
        </h5>
        <p className='text-neutral-400 small mb-0'>
          <UsdValue input={bNtotalLocked.toString(10)} showPrefix />
        </p>
      </div>
      <Chart.Donut config={config} />
    </>
  );
};
