import { useSelector } from 'react-redux';

import { formatBigNumber } from 'helpers';
import { useHasGrowthWidgets, useFetchGrowthMostUsed } from 'hooks';
import { growthMostUsedSelector } from 'redux/selectors';
import { SearchCollectionRow } from '../SearchResults/rows/SearchCollectionRow';

export const SearchTopCollections = () => {
  const hasGrowthWidgets = useHasGrowthWidgets();

  const { isDataReady, dailyMostTransactedNFTs } = useSelector(
    growthMostUsedSelector
  );

  useFetchGrowthMostUsed();

  if (!hasGrowthWidgets || !isDataReady) {
    return null;
  }

  return (
    <div className='search-group search-top-apps'>
      <div className='search-category'>
        Top NFT Collections<div className='ms-auto'>Txn / 24h</div>
      </div>
      {dailyMostTransactedNFTs
        .slice(0, 3)
        .map(({ key: identifier, value, extraInfo }) => {
          return (
            <SearchCollectionRow
              key={identifier}
              identifier={identifier}
              assets={extraInfo?.assets}
              isVerified={extraInfo?.isVerified}
            >
              <div className='ms-auto'>{formatBigNumber({ value })}</div>
            </SearchCollectionRow>
          );
        })}
    </div>
  );
};
