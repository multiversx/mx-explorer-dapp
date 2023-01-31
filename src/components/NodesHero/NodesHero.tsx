import React from 'react';

import { useSelector } from 'react-redux';
import { MultilayerPercentageRing } from 'components';
import { useIsMainnet } from 'hooks';
import { ChartStake } from 'pages/Home/ChartStake';
import { nodesVersionsSelector } from 'redux/selectors';
import { ValidatorsStatusCard } from 'widgets';

export const NodesHero = () => {
  const { nodesVersions } = useSelector(nodesVersionsSelector);
  const isMainnet = useIsMainnet();

  if (!isMainnet) {
    return null;
  }

  return (
    <div className='nodes-hero card card-lg card-black mb-3'>
      <div className='card-header'>
        <h2 className='mb-0'>Validators</h2>
      </div>

      <div className='card-body pb-3'>
        <div className='row'>
          <div className='col-lg-5 mb-3'>
            <ChartStake className='unstyled-chart-box bg-neutral-900' />
          </div>
          <div className='col-lg-7 mb-3'>
            <div className='h-100 d-flex flex-column'>
              <ValidatorsStatusCard className='bg-neutral-900 mb-3 mb-lg-0' />

              <div className='card distribution-card bg-neutral-900 weighted-node-card'>
                <div className='card-body d-flex flex-row flex-wrap align-items-center justify-content-between'>
                  <div className='distribution-card-title text-neutral-500 mb-2'>
                    Stake Weighted Node Version
                  </div>
                  <div className='distribution-card-value'>
                    <MultilayerPercentageRing steps={nodesVersions} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
