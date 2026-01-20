import { useSelector } from 'react-redux';

import { MAX_SEARCH_SUGGESTION_COUNT } from 'appConstants';
import { FormatAmount } from 'components';
import { urlBuilder } from 'helpers';

import { searchSelector } from 'redux/selectors';
import { AccountType } from 'types';
import { SearchAppRow } from '../rows/SearchAppRow';
import { SearchAllResults } from '../SearchAllResults';

export const SearchAppsCategory = ({ apps }: { apps: AccountType[] }) => {
  const { search, searchQuery } = useSelector(searchSelector);
  const { accounts: totalSearchAccounts = [] } = search;
  const showAllRow = totalSearchAccounts.length > MAX_SEARCH_SUGGESTION_COUNT;

  if (apps.length === 0) {
    return null;
  }

  return (
    <>
      <div className='search-category'>
        Applications<div className='ms-auto'>Balance</div>
      </div>
      {apps.slice(0, MAX_SEARCH_SUGGESTION_COUNT).map((app) => {
        const { address, assets, balance } = app;
        return (
          <SearchAppRow address={address} assets={assets} key={address}>
            <div className='ms-auto'>
              <FormatAmount value={balance} />
            </div>
          </SearchAppRow>
        );
      })}
      {showAllRow && (
        <SearchAllResults to={urlBuilder.applications({ search: searchQuery })}>
          All Apps
        </SearchAllResults>
      )}
    </>
  );
};
