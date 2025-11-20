import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { MAX_SEARCH_SUGGESTION_COUNT } from 'appConstants';
import { FormatUSD, LowLiquidityTooltip } from 'components';
import { urlBuilder } from 'helpers';
import { searchSelector } from 'redux/selectors';
import { SearchTokenRow } from './rows/SearchTokenRow';

import { SearchAllResults } from './SearchAllResults';

export const SearchTokens = () => {
  const { search, searchQuery } = useSelector(searchSelector);
  const { token, tokens: searchTokens = [] } = search;

  const tokens = useMemo(() => {
    const merged = [...searchTokens];
    if (token) {
      merged.push(token);
    }

    const unique = [
      ...new Map(merged.map((token) => [token.identifier, token])).values()
    ].sort((a, b) => {
      return (
        (b.marketCap ?? 0) - (a.marketCap ?? 0) ||
        (a.assets ? -1 : 1) ||
        (b.transfers ?? 0) - (a.transfers ?? 0)
      );
    });

    return unique;
  }, [token, searchTokens]);

  if (searchTokens.length === 0 && !token) {
    return null;
  }

  return (
    <div className='search-group search-accounts'>
      <div className='search-category'>
        Tokens<div className='ms-auto'>Price</div>
      </div>
      {tokens.slice(0, MAX_SEARCH_SUGGESTION_COUNT).map((token) => {
        const { identifier, assets } = token;
        return (
          <SearchTokenRow
            key={identifier}
            identifier={identifier}
            assets={assets}
          >
            <div className='ms-auto'>
              {token.price && (
                <>
                  <FormatUSD value={token.price} usd={1} showPrefix={false} />
                  <LowLiquidityTooltip token={token} />
                </>
              )}
            </div>
          </SearchTokenRow>
        );
      })}
      {tokens.length > MAX_SEARCH_SUGGESTION_COUNT && (
        <SearchAllResults to={urlBuilder.tokens({ search: searchQuery })}>
          All Tokens
        </SearchAllResults>
      )}
    </div>
  );
};
