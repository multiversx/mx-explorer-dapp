import { useSelector } from 'react-redux';

import { Loader } from 'components';
import { searchSelector } from 'redux/selectors';
import { SearchMostUsed } from './SearchMostUsed';
import { SearchResults } from './SearchResults';

export const SearchSuggestions = () => {
  const { searchQuery, isDataReady } = useSelector(searchSelector);

  if (isDataReady === false) {
    return <Loader />;
  }

  return (
    <div className='search-suggestions'>
      {searchQuery ? <SearchResults /> : <SearchMostUsed />}
    </div>
  );
};
