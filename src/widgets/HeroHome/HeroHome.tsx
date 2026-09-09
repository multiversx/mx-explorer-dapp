import { ReactNode } from 'react';
import { useSelector } from 'react-redux';

import { BRAND_NAME } from 'appConstants';
import {
  GlobeAnimation,
  GlobeProposerCard,
  Search,
  Particles,
  useGlobeFeed
} from 'components';
import { networks } from 'config';
import { getSkipAnimation } from 'helpers';
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

interface HeroHomeLayoutType {
  background: ReactNode;
  aside?: ReactNode;
}

const HeroHomeLayout = ({ background, aside }: HeroHomeLayoutType) => {
  const isMainnet = useIsMainnet();
  const { id, name } = useSelector(activeNetworkSelector);
  const explorerTitle =
    (id === NetworkIdEnum.mainnet && networks.length === 1) ||
    name?.toLowerCase() === BRAND_NAME.toLowerCase()
      ? 'Explorer'
      : `${name} Explorer`;

  return (
    <div className='hero-home card card-lg card-black'>
      {background}
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
                {isMainnet && import.meta.env.VITE_APP_MARKERS_API_URL && (
                  <ValidatorsStatusCard isSmall />
                )}
              </div>
            </div>
            <div className='col-lg-4 d-flex flex-column align-items-center align-items-lg-end justify-content-end mt-3 mt-lg-0 gap-3'>
              <div className='d-flex flex-row gap-spacer gap-lg-2 align-items-end'>
                <BlockProgressRing />
                <EpochProgressRing />
              </div>
              {aside}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const GlobeHeroHome = () => {
  const { markers, activeBlock, event } = useGlobeFeed();

  return (
    <HeroHomeLayout
      background={<GlobeAnimation markers={markers} event={event} />}
      aside={
        <GlobeProposerCard
          key={activeBlock?.hash}
          block={activeBlock}
          isLocationMatched={event?.isMatched}
        />
      }
    />
  );
};

export const HeroHome = () => {
  const isMainnet = useIsMainnet();
  const showGlobe = isMainnet && !getSkipAnimation();

  return showGlobe ? (
    <GlobeHeroHome />
  ) : (
    <HeroHomeLayout background={<Particles />} />
  );
};
