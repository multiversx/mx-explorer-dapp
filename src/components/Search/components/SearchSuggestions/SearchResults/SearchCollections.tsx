import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { FormatNumber } from 'components';
import { searchSelector } from 'redux/selectors';
import { SearchCollectionRow } from './rows/SearchCollectionRow';
import { MAX_SEARCH_SUGGESTION_COUNT } from 'appConstants';
import { urlBuilder } from 'helpers';
import { SearchAllResults } from './SearchAllResults';

export const SearchCollections = () => {
  const { search, searchQuery } = useSelector(searchSelector);
  const { collection, collections: searchCollections = [] } = search;

  const collections = useMemo(() => {
    const merged = [...searchCollections];
    if (collection) {
      merged.push(collection);
    }

    const unique = [
      ...new Map(
        merged.map((collection) => [collection.collection, collection])
      ).values()
    ].sort((a, b) => {
      return (b.holderCount ?? 0) - (a.holderCount ?? 0) || (a.assets ? -1 : 1);
    });
    return unique;
  }, [collection, searchCollections]);

  if (searchCollections.length === 0 && !collection) {
    return null;
  }

  return (
    <div className='search-group search-collections'>
      <div className='search-category'>
        NFT Collections<div className='ms-auto'>Holders</div>
      </div>
      {collections.slice(0, MAX_SEARCH_SUGGESTION_COUNT).map((collection) => {
        const {
          collection: collectionIdentifier,
          assets,
          type,
          isVerified
        } = collection;
        return (
          <SearchCollectionRow
            key={collectionIdentifier}
            identifier={collectionIdentifier}
            assets={assets}
            isVerified={isVerified}
            type={type}
          >
            <div className='ms-auto'>
              {collection.holderCount && (
                <FormatNumber value={collection.holderCount} />
              )}
            </div>
          </SearchCollectionRow>
        );
      })}
      {collections.length > MAX_SEARCH_SUGGESTION_COUNT && (
        <SearchAllResults to={urlBuilder.collections({ search: searchQuery })}>
          All Collections
        </SearchAllResults>
      )}
    </div>
  );
};
