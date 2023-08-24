import { useSelector } from 'react-redux';

import { Loader } from 'components';
import { useIsMainnet, useFetchGrowthMostUsed } from 'hooks';
import { growthMostUsedSelector } from 'redux/selectors';

import { MostUsedCollections } from './MostUsedCollections';
import { MostUsedContracts } from './MostUsedContracts';
import { MostUsedTokens } from './MostUsedTokens';

export const MostUsed = () => {
  const isMainnet = useIsMainnet();

  const {
    isFetched,
    dailyMostUsedApplications,
    dailyMostTransactedNFTs,
    dailyMostTransactedTokens
  } = useSelector(growthMostUsedSelector);

  useFetchGrowthMostUsed();

  return (
    <>
      {isMainnet ? (
        <>
          {isFetched ? (
            <div className='row'>
              <div className='col-12 col-lg-4 mt-3'>
                <MostUsedContracts data={dailyMostUsedApplications} />
              </div>
              <div className='col-12 col-lg-4 mt-3'>
                <MostUsedCollections data={dailyMostTransactedNFTs} />
              </div>
              <div className='col-12 col-lg-4 mt-3'>
                <MostUsedTokens data={dailyMostTransactedTokens} />
              </div>
            </div>
          ) : (
            <Loader />
          )}
        </>
      ) : (
        <></>
      )}
    </>
  );
};
