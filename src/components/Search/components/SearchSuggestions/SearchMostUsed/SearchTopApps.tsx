import { useSelector } from 'react-redux';

import { formatBigNumber } from 'helpers';
import { useHasGrowthWidgets, useFetchGrowthMostUsed } from 'hooks';
import { growthMostUsedSelector } from 'redux/selectors';
import { SearchAppRow } from '../SearchResults/rows/SearchAppRow';

export const SearchTopApps = () => {
  const hasGrowthWidgets = useHasGrowthWidgets();

  const { isDataReady, dailyMostUsedApplications } = useSelector(
    growthMostUsedSelector
  );

  useFetchGrowthMostUsed();

  if (!hasGrowthWidgets || !isDataReady) {
    return null;
  }

  return (
    <div className='search-group search-top-collections'>
      <div className='search-category'>
        Top Apps<div className='ms-auto'>Txn / 24h</div>
      </div>
      {dailyMostUsedApplications
        .slice(0, 3)
        .map(({ key: address, value, extraInfo }) => {
          return (
            <SearchAppRow
              key={address}
              address={address}
              assets={extraInfo?.assets}
              isVerified={extraInfo?.isVerified}
            >
              <div className='ms-auto'>{formatBigNumber({ value })}</div>
            </SearchAppRow>
          );
        })}
    </div>
  );
};
