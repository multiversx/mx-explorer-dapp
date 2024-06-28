import { useSelector } from 'react-redux';

import { BRAND_NAME } from 'appConstants';
import { Search, Particles } from 'components';
import { networks } from 'config';
import { useIsMainnet } from 'hooks';
import { activeNetworkSelector } from 'redux/selectors';
import { NetworkIdEnum } from 'types';
import {
  AccountsStatsCard,
  BlockHeightStatsCard,
  TransactionsStatsCard,
  ValidatorsStatusCard,
  BlockProgressRing,
  EpochProgressRing
} from 'widgets';

export const HeroHome = () => {
  const isMainnet = useIsMainnet();

  const { id, name } = useSelector(activeNetworkSelector);
  const explorerTitle =
    id === NetworkIdEnum.mainnet && networks.length === 1
      ? 'Explorer'
      : `${name} Explorer`;

  return (
    <div className='hero-home card card-lg card-black'>
      <Particles />
      <div className='card-body d-flex flex-column justify-content-between'>
        <div className='row'>
          <div className='col-lg-6'>
            <h1 className='h2 mb-4 font-headings title'>
              {BRAND_NAME} Blockchain {explorerTitle}
            </h1>
            <Search />
          </div>
        </div>

        <div className='d-flex flex-column gap-3'>
          <div className='row'>
            <div className='col-lg-8'>
              <div className='d-flex flex-row flex-wrap w-100 gap-3'>
                <div className='w-100'>
                  <BlockHeightStatsCard />
                </div>
                <TransactionsStatsCard />
                <AccountsStatsCard />
                {isMainnet && process.env.VITE_APP_MARKERS_API_URL && (
                  <ValidatorsStatusCard isSmall />
                )}
              </div>
            </div>
            <div className='col-lg-4 d-flex flex-row align-items-end justify-content-center justify-content-lg-end mt-3 mt-lg-0 gap-spacer gap-lg-2'>
              <BlockProgressRing />
              <EpochProgressRing />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
