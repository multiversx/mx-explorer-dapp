import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { FormatUSD, LowLiquidityTooltip } from 'components';
import { searchSelector } from 'redux/selectors';
import { SearchTokenRow } from './rows/SearchTokenRow';

export const SearchTokens = () => {
  const { search } = useSelector(searchSelector);
  const { token, tokens: searchTokens = [] } = search;

  const tokens = useMemo(() => {
    const merged = [...searchTokens];
    if (token) {
      merged.push(token);
    }

    const unique = [
      ...new Map(merged.map((token) => [token.identifier, token])).values()
    ].sort((a, b) => {
      return (b.marketCap ?? 0) - (a.marketCap ?? 0) || (a.assets ? -1 : 1);
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
      {tokens.map((token) => {
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
    </div>
  );
};
