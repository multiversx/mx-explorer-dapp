import React from 'react';

import { useSelector } from 'react-redux';
import { MultilayerPercentageBar, ValidatorsStatus } from 'components';
import { ChartStake } from 'pages/Home/ChartStake';
import { nodesVersionsSelector } from 'redux/selectors';

export const NodesHero = () => {
  const { nodesVersions } = useSelector(nodesVersionsSelector);

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
              <ValidatorsStatus className='bg-neutral-900 mb-3' />
              <div className='card bg-neutral-900'>
                <div className='card-body d-flex align-items-center justify-content-between'>
                  <div>Stake Weighted Node Version</div>
                  <MultilayerPercentageBar steps={nodesVersions} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
