import React, { useEffect, useState } from 'react';
import { faSearch } from '@fortawesome/pro-regular-svg-icons/faSearch';
import { useNavigate, useParams } from 'react-router-dom';
import { PageState, Loader } from 'components';
import { useSearch, useNetworkRoute } from 'hooks';

export const HashSearch = () => {
  const { hash: query } = useParams() as any;
  const navigate = useNavigate();
  const networkRoute = useNetworkRoute();
  const notFoundRoute = networkRoute(`/search/${query}`);
  const { search, isSearching, searchRoute } = useSearch(query);

  useEffect(() => {
    search();
  }, [query]);

  return (
    <>
      {isSearching === undefined && <Loader />}
      {isSearching === false && (
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
              className='py-spacer m-auto'
              dataTestId='errorScreen'
            />
          )}
        </>
      )}
    </>
  );
};
