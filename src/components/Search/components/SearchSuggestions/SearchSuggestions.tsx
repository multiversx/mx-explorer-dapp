import { useSelector } from 'react-redux';

import { Loader } from 'components';
import { useHasGrowthWidgets, useFetchGrowthMostUsed } from 'hooks';
import { growthMostUsedSelector } from 'redux/selectors';
import { SearchTopApps } from './SearchTopApps';
import { SearchTopCollections } from './SearchTopCollections';
import { SearchTopTokens } from './SearchTopTokens';

export const SearchSuggestions = () => {
  const hasGrowthWidgets = useHasGrowthWidgets();

  const { isDataReady } = useSelector(growthMostUsedSelector);

  useFetchGrowthMostUsed();

  if (!hasGrowthWidgets) {
    return null;
  }

  return (
    <div className='search-suggestions'>
      {isDataReady ? (
        <>
          <SearchTopTokens />
          <SearchTopApps />
          <SearchTopCollections />
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
};
