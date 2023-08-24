import { useSelector } from 'react-redux';

import { MultilayerPercentageRing } from 'components';
import { useIsMainnet } from 'hooks';
import { ChartStake } from 'pages/Home/components/ChartStake';
import { nodesVersionsSelector } from 'redux/selectors';
import { ValidatorsStatusCard } from 'widgets';

export const HeroNodes = () => {
  const { nodesVersions } = useSelector(nodesVersionsSelector);
  const isMainnet = useIsMainnet();

  return (
    <div className='hero-nodes card-body pb-3'>
      <div className='row'>
        {isMainnet && (
          <div className='col-lg-5 mb-3'>
            <ChartStake className='unstyled-chart-box bg-neutral-900' />
          </div>
        )}
        <div className={`mb-3 ${isMainnet ? 'col-lg-7' : 'col'}`}>
          <div className='h-100 d-flex flex-column'>
            <ValidatorsStatusCard
              className={`bg-neutral-900 mb-3 mb-lg-0 ${
                isMainnet ? 'mainnet-layout' : ''
              }`}
            />

            <div className='card distribution-card bg-neutral-900 weighted-node-card d-lg-none'>
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
  );
};
