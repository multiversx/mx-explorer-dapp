import { useSelector } from 'react-redux';

import { Loader } from 'components';
import { useHasGrowthWidgets, useFetchGrowthMostUsed } from 'hooks';
import { growthMostUsedSelector } from 'redux/selectors';

import { MostUsedApplications } from './MostUsedApplications';
import { MostUsedCollections } from './MostUsedCollections';
import { MostUsedTokens } from './MostUsedTokens';

export const MostUsed = () => {
  const hasGrowthWidgets = useHasGrowthWidgets();

  const { isFetched, dailyMostTransactedNFTs, dailyMostTransactedTokens } =
    useSelector(growthMostUsedSelector);

  useFetchGrowthMostUsed();

  if (!hasGrowthWidgets) {
    return null;
  }

  if (!isFetched) {
    return <Loader />;
  }

  return (
    <div className='row most-used'>
      <div className='col-12 mt-3'>
        <MostUsedApplications showDashboardLink />
      </div>
      <div className='col-12 col-lg-7 mt-3'>
        <MostUsedCollections data={dailyMostTransactedNFTs} />
      </div>
      <div className='col-12 col-lg-5 mt-3'>
        <MostUsedTokens data={dailyMostTransactedTokens} />
      </div>
    </div>
  );
};
