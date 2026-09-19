import { useSelector } from 'react-redux';

import { formatBigNumber } from 'helpers';
import { useHasGrowthWidgets, useFetchGrowthMostUsed } from 'hooks';
import { growthMostUsedSelector } from 'redux/selectors';
import { SearchTokenRow } from '../SearchResults/rows/SearchTokenRow';

export const SearchTopTokens = () => {
  const hasGrowthWidgets = useHasGrowthWidgets();

  const { isDataReady, dailyMostTransactedTokens } = useSelector(
    growthMostUsedSelector
  );

  useFetchGrowthMostUsed();

  if (!hasGrowthWidgets || !isDataReady) {
    return null;
  }

  return (
    <div className='search-group search-top-tokens'>
      <div className='search-category'>
        Top Tokens<div className='ms-auto'>Txn / 24h</div>
      </div>
      {dailyMostTransactedTokens
        .slice(0, 3)
        .map(({ key: identifier, value, extraInfo }) => {
          return (
            <SearchTokenRow
              key={identifier}
              identifier={identifier}
              assets={extraInfo?.assets}
              ticker={extraInfo?.ticker}
              name={extraInfo?.name}
            >
              <div className='ms-auto'>{formatBigNumber({ value })}</div>
            </SearchTokenRow>
          );
        })}
    </div>
  );
};
