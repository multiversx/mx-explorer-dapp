import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { MAX_SEARCH_SUGGESTION_COUNT } from 'appConstants';
import { NetworkLink, NftBadge } from 'components';
import { isProof, urlBuilder } from 'helpers';
import { searchSelector } from 'redux/selectors';
import { SearchAllResults } from './SearchAllResults';

export const SearchNfts = () => {
  const { search, searchQuery } = useSelector(searchSelector);
  const { nft, nfts: searchNfts = [] } = search;

  const nfts = useMemo(() => {
    const merged = [...searchNfts];
    if (nft) {
      merged.push(nft);
    }

    const unique = [
      ...new Map(merged.map((nft) => [nft.identifier, nft])).values()
    ].sort((nft) => {
      return nft.assets ? -1 : 1;
    });
    return unique;
  }, [nft, searchNfts]);

  if (searchNfts.length === 0 && !nft) {
    return null;
  }

  return (
    <div className='search-group search-nfts'>
      <div className='search-category'>
        NFTs<div className='ms-auto'>Name</div>
      </div>
      {nfts.slice(0, MAX_SEARCH_SUGGESTION_COUNT).map((nft) => {
        return (
          <NetworkLink
            to={urlBuilder.nftDetails(nft.identifier)}
            key={nft.identifier}
            className='search-suggestion selectable'
          >
            <div className='search-text trim text-truncate'>
              {nft.assets && nft.assets.svgUrl && (
                <img
                  src={nft.assets.svgUrl}
                  className='side-icon me-1'
                  alt=''
                  role='presentation'
                />
              )}
              <div className='text-truncate'>{nft.identifier}</div>
              <NftBadge
                type={nft.type}
                subType={nft.subType}
                isProof={isProof(nft)}
                className='ms-2'
              />
            </div>
            <div className='ms-auto'>{nft.name}</div>
          </NetworkLink>
        );
      })}
      {nfts.length > MAX_SEARCH_SUGGESTION_COUNT && (
        <SearchAllResults to={urlBuilder.nfts({ search: searchQuery })}>
          All NFTs
        </SearchAllResults>
      )}
    </div>
  );
};
