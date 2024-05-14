import { useHasGrowthWidgets } from 'hooks';
import { WithClassnameType } from 'types';
import { ActiveAccountsHeroPill } from './ActiveAccountsHeroPill';
import { EpochHeroPill } from './EpochHeroPill';
import { PriceHeroPill } from './PriceHeroPill';

export const HeroPills = ({ className }: WithClassnameType) => {
  const hasGrowthWidgets = useHasGrowthWidgets();

  return (
    <div className='hero-pills-wrapper'>
      <div
        className={`hero-pills d-flex gap-3 align-items-center justify-content-center justify-content-lg-end mb-3 mb-lg-0 ${
          className ?? ''
        }`}
      >
        <EpochHeroPill />
        {hasGrowthWidgets && (
          <>
            <PriceHeroPill />
            <ActiveAccountsHeroPill />
          </>
        )}
      </div>
    </div>
  );
};
