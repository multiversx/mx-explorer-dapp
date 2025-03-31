import { useEffect } from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';

import { NAVIGATION_SEARCH_STATE } from 'appConstants';
import { PageState, Loader } from 'components';
import { useSearch, useNetworkRoute } from 'hooks';
import { faSearch } from 'icons/regular';

export const HashSearch = () => {
  const { hash: query } = useParams() as any;
  const location = useLocation();
  const networkRoute = useNetworkRoute();
  const notFoundRoute = networkRoute(`/search/${query}`);
  const { search, isSearching, searchRoute } = useSearch(query);

  useEffect(() => {
    if (location.state !== NAVIGATION_SEARCH_STATE) {
      location.state = undefined;
      search();
    }
  }, [query, location]);

  if (isSearching) {
    return <Loader />;
  }

  if (searchRoute && searchRoute !== notFoundRoute) {
    return <Navigate to={searchRoute} />;
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
