import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { FormatNumber } from 'components';
import { searchSelector } from 'redux/selectors';
import { SearchCollectionRow } from './rows/SearchCollectionRow';

export const SearchCollections = () => {
  const { search } = useSelector(searchSelector);
  const { collection, collections: searchCollections = [] } = search;

  const collectios = useMemo(() => {
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
    <div className='search-group search-accounts'>
      <div className='search-category'>
        Collections<div className='ms-auto'>Holders</div>
      </div>
      {collectios.map((collection) => {
        const {
          collection: collectionIdentifier,
          assets,
          isVerified
        } = collection;
        return (
          <SearchCollectionRow
            key={collectionIdentifier}
            identifier={collectionIdentifier}
            assets={assets}
            isVerified={isVerified}
          >
            <div className='ms-auto'>
              {collection.holderCount && (
                <FormatNumber value={collection.holderCount} />
              )}
            </div>
          </SearchCollectionRow>
        );
      })}
    </div>
  );
};
