import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useParams } from 'react-router';

import { PageState, Loader } from 'components';
import { useGetSearchRedirectRoute } from 'components/Search/hooks';
import { useSearch } from 'hooks';
import { faSearch } from 'icons/regular';
import { searchSelector } from 'redux/selectors';

import { routes } from 'routes';

export const HashSearch = () => {
  const { hash: query } = useParams() as any;

  const redirectRoute = useGetSearchRedirectRoute();
  const { search } = useSearch(query);
  const {
    search: searchResults,
    searchQuery,
    isDataReady
  } = useSelector(searchSelector);

  const hasSearchResults = Object.keys(searchResults).length > 0;

  useEffect(() => {
    search();
  }, [query]);

  if (!isDataReady) {
    return <Loader />;
  }

  if (searchQuery) {
    if (redirectRoute) {
      return <Navigate to={redirectRoute} />;
    }

    if (hasSearchResults) {
      return <Navigate to={routes.home} state={{ searchQuery }} />;
    }
  }

  return (
    <PageState
      icon={faSearch}
      title="Your search does not match anything we've got"
      description={
        <div className='px-spacer'>
          <span className='text-break-all'>{query}</span>
        </div>
      }
      isError
    />
  );
};
