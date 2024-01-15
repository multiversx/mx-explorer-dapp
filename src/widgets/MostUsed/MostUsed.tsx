import { useSelector } from 'react-redux';

import { Loader } from 'components';
import { useIsMainnet, useFetchGrowthMostUsed } from 'hooks';
import { growthMostUsedSelector } from 'redux/selectors';

import { MostUsedApplications } from './MostUsedApplications';
import { MostUsedCollections } from './MostUsedCollections';
import { MostUsedTokens } from './MostUsedTokens';

export const MostUsed = () => {
  const isMainnet = useIsMainnet();

  const { isFetched, dailyMostTransactedNFTs, dailyMostTransactedTokens } =
    useSelector(growthMostUsedSelector);

  useFetchGrowthMostUsed();

  if (!isMainnet) {
    return null;
  }

  if (!isFetched) {
    return <Loader />;
  }

  return (
    <div className='row'>
      <div className='col-12 col-lg-6 mt-3'>
        <MostUsedCollections data={dailyMostTransactedNFTs} />
      </div>
      <div className='col-12 col-lg-6 mt-3'>
        <MostUsedTokens data={dailyMostTransactedTokens} />
      </div>
      <div className='col-12 mt-3'>
        <MostUsedApplications size={10} />
      </div>
    </div>
  );
};
