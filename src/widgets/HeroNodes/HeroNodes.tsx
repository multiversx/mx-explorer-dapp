import { useSelector } from 'react-redux';

import { MultilayerPercentageRing } from 'components';
import { useHasGrowthWidgets } from 'hooks';
import { ChartStake } from 'pages/Home/components/ChartStake';
import { nodesVersionsSelector } from 'redux/selectors';
import { ValidatorsStatusCard } from 'widgets';

export const HeroNodes = () => {
  const { nodesVersions } = useSelector(nodesVersionsSelector);
  const hasGrowthWidgets = useHasGrowthWidgets();

  return (
    <div className='hero-nodes card-body pb-3'>
      <div className='row'>
        {hasGrowthWidgets && (
          <div className='col-lg-5 mb-3'>
            <ChartStake className='unstyled-chart-box bg-neutral-950' />
          </div>
        )}
        <div className={`mb-3 ${hasGrowthWidgets ? 'col-lg-7' : 'col'}`}>
          <div className='h-100 d-flex flex-column'>
            <ValidatorsStatusCard
              className={`mb-3 mb-lg-0 ${
                hasGrowthWidgets ? 'mainnet-layout' : ''
              }`}
            />

            <div className='card distribution-card weighted-node-card d-lg-none'>
              <div className='card-body d-flex flex-row flex-wrap align-items-center justify-content-between'>
                <div className='distribution-card-title font-headings text-neutral-500 mb-2'>
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
