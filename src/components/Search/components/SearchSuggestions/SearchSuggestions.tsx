import { memo, ReactNode } from 'react';
import { useSelector } from 'react-redux';

import { Loader } from 'components';
import { useHasGrowthWidgets } from 'hooks';
import { searchSelector } from 'redux/selectors';
import { SearchMostUsed } from './SearchMostUsed';
import { SearchResults } from './SearchResults';
import { SearchFooter } from '../SearchFooter';

export const SearchSuggestions = memo(
  ({ searchHash = '' }: { searchHash?: string }) => {
    const { searchQuery, isDataReady } = useSelector(searchSelector);
    const hasGrowthWidgets = useHasGrowthWidgets();
    const trimmedSearchHash = String(searchHash).trim();

    const SearchContentWrapper = ({ children }: { children: ReactNode }) => {
      return (
        <div className='search-content'>
          {children}
          <SearchFooter />
        </div>
      );
    };

    if (trimmedSearchHash.length < 3) {
      if (hasGrowthWidgets) {
        return (
          <SearchContentWrapper>
            <div className='search-suggestions'>
              <SearchMostUsed />
            </div>
          </SearchContentWrapper>
        );
      }

      return null;
    }

    if (isDataReady === false && searchQuery) {
      return (
        <SearchContentWrapper>
          <Loader />
        </SearchContentWrapper>
      );
    }

    if (searchQuery) {
      return (
        <SearchContentWrapper>
          <div className='search-suggestions'>
            <SearchResults />
          </div>
        </SearchContentWrapper>
      );
    }

    if (hasGrowthWidgets) {
      return (
        <SearchContentWrapper>
          <div className='search-suggestions'>
            <SearchMostUsed />
          </div>
        </SearchContentWrapper>
      );
    }

    return null;
  }
);
