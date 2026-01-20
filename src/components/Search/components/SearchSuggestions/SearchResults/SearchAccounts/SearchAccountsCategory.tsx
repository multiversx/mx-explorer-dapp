import { useSelector } from 'react-redux';

import { MAX_SEARCH_SUGGESTION_COUNT } from 'appConstants';
import { urlBuilder } from 'helpers';
import { searchSelector } from 'redux/selectors';
import { AccountType } from 'types';
import { SearchAccountRow } from '../rows/SearchAccountRow';
import { SearchAllResults } from '../SearchAllResults';

export const SearchAccountsCategory = ({
  accounts
}: {
  accounts: AccountType[];
}) => {
  const { search, searchQuery } = useSelector(searchSelector);
  const { accounts: totalSearchAccounts = [] } = search;
  const showAllRow = totalSearchAccounts.length > MAX_SEARCH_SUGGESTION_COUNT;

  if (accounts.length === 0) {
    return null;
  }

  return (
    <>
      <div className='search-category'>
        Accounts<div className='ms-auto'>Balance</div>
      </div>
      {accounts.slice(0, MAX_SEARCH_SUGGESTION_COUNT).map((account) => (
        <SearchAccountRow account={account} key={account.address} />
      ))}
      {showAllRow && (
        <SearchAllResults to={urlBuilder.accounts({ search: searchQuery })}>
          All Accounts
        </SearchAllResults>
      )}
    </>
  );
};
