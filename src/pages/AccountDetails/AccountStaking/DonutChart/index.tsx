import React from 'react';

import { AccountStakingDetailsType } from 'context/state';

import { prepareChartData } from './helpers/prepareChartData';
import { ProviderType } from 'types';
import { Denominate, UsdValue, Chart } from 'components';
import { ChartConfigType } from 'components/Chart/helpers/types';

export const DonutChart = ({
  stakingDetails,
  providers,
}: {
  stakingDetails: AccountStakingDetailsType;
  providers?: ProviderType[];
}) => {
  const chartData = providers ? prepareChartData({ stakingDetails, providers }) : [];
  const { bNtotalLocked } = stakingDetails;

  const config: ChartConfigType[] = [
    {
      id: 'stake',
      label: 'stake',
      data: chartData,
    },
  ];

  return (
    <>
      <div className="staking-details-center">
        <h5 className="mb-1 h6">{bNtotalLocked.isEqualTo(0) ? 'No staking' : 'Total Staked'}</h5>
        <h6 className="mb-1 h5">
          <Denominate value={bNtotalLocked.toString(10)} decimals={2} />
        </h6>
        <p className="text-secondary small mb-0">
          <UsdValue input={bNtotalLocked.toString(10)} showPrefix />
        </p>
      </div>
      <Chart.Donut config={config} />
    </>
  );
};
