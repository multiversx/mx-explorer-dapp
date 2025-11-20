import { useSelector } from 'react-redux';

import { PageState } from 'components';
import { faSearch } from 'icons/regular';
import { searchSelector } from 'redux/selectors';
import { SearchAccounts } from './SearchAccounts';
import { SearchBlocks } from './SearchBlocks';
import { SearchCollections } from './SearchCollections';
import { SearchNfts } from './SearchNfts';
import { SearchNodes } from './SearchNodes';
import { SearchTokens } from './SearchTokens';
import { SearchTransactions } from './SearchTransactions';

export const SearchResults = () => {
  const { search, searchQuery } = useSelector(searchSelector);

  const hasSearchResults = Object.keys(search).length > 0;
  // const {
  //==   account,
  //==   token,
  //==   collection,
  //==   nft,
  //   node,
  //   block,
  //   miniblock,
  //==   transaction,
  //==   scResult,
  //==   transactionInPool,
  //==   accounts,
  //==   tokens,
  //==   collections,
  //==   nfts
  // } = search;

  console.log('---search', search);

  if (!hasSearchResults) {
    return (
      <PageState
        icon={faSearch}
        title="Your search does not match anything we've got"
        description={
          <div className='px-spacer'>
            <span className='text-break-all'>{searchQuery}</span>
          </div>
        }
        isError
      />
    );
  }

  return (
    <>
      <SearchTokens />
      <SearchAccounts />
      <SearchCollections />
      <SearchNfts />
      <SearchTransactions />
      <SearchBlocks />
      <SearchNodes />
    </>
  );
};
