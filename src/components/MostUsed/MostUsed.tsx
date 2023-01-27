import React from 'react';
import { useSelector } from 'react-redux';

import { Loader } from 'components';
import { useIsMainnet } from 'hooks';
import { growthMostUsedSelector } from 'redux/selectors';

import { useFetchMostUsed } from './helpers/useFetchMostUsed';
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

  useFetchMostUsed();

  return (
    <>
      {isMainnet ? (
        <>
          {isFetched ? (
            <div className='row'>
              <div className='col-12 col-lg-4 mt-spacer'>
                <MostUsedContracts data={dailyMostUsedApplications} />
              </div>
              <div className='col-12 col-lg-4 mt-spacer'>
                <MostUsedCollections data={dailyMostTransactedNFTs} />
              </div>
              <div className='col-12 col-lg-4 mt-spacer'>
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
