import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageState, Loader } from 'components';
import { useSearch, useNetworkRoute } from 'hooks';
import { faSearch } from 'icons/regular';

export const HashSearch = () => {
  const { hash: query } = useParams() as any;
  const navigate = useNavigate();
  const networkRoute = useNetworkRoute();
  const notFoundRoute = networkRoute(`/search/${query}`);
  const { search, isSearching, searchRoute } = useSearch(query);

  useEffect(() => {
    search();
  }, [query]);

  if (isSearching) {
    return <Loader />;
  }

  return (
    <>
      {searchRoute && searchRoute !== notFoundRoute ? (
        navigate(searchRoute)
      ) : (
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
      )}
    </>
  );
};
