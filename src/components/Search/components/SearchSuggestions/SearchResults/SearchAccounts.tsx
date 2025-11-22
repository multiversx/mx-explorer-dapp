import { useMemo } from 'react';
import { isContract } from '@multiversx/sdk-dapp';
import BigNumber from 'bignumber.js';
import { useSelector } from 'react-redux';

import { MAX_SEARCH_SUGGESTION_COUNT } from 'appConstants';
import { FormatAmount } from 'components';
import { urlBuilder } from 'helpers';
import { useGetSearchQueryType } from 'hooks/search/useGetSearchQueryType';
import { searchSelector } from 'redux/selectors';
import { AccountType } from 'types';
import { SearchAccountRow } from './rows/SearchAccountRow';
import { SearchAppRow } from './rows/SearchAppRow';
import { SearchAllResults } from './SearchAllResults';

export const SearchAccounts = () => {
  const { search, searchQuery } = useSelector(searchSelector);
  const { account, accounts: searchAccounts = [] } = search;
  const getSearchQueryType = useGetSearchQueryType();

  const { isUsername: isUsernameQuery } = getSearchQueryType(searchQuery);

  const [accounts, apps] = useMemo(() => {
    const merged = [...searchAccounts];
    if (account) {
      merged.push(account);
    }
    const unique = [
      ...new Map(merged.map((account) => [account.address, account])).values()
    ];

    const [splitAccounts, splitApps] = unique.reduce(
      (result, element) => {
        const isApp = isContract(element.address);
        result[isApp ? 1 : 0].push(element);
        return result;
      },
      [[] as AccountType[], [] as AccountType[]]
    );

    splitAccounts.sort((a, b) => {
      return (
        (a.username ? -1 : 1) ||
        new BigNumber(b.balance).minus(a.balance).toNumber()
      );
    });

    splitApps.sort((a, b) => {
      return (
        b.txCount - a.txCount ||
        new BigNumber(b.balance).minus(a.balance).toNumber()
      );
    });

    return [splitAccounts, splitApps];
  }, [account, searchAccounts]);

  if (searchAccounts.length === 0 && !account) {
    return null;
  }

  const Accounts = () => {
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
        {accounts.length > MAX_SEARCH_SUGGESTION_COUNT && (
          <SearchAllResults to={urlBuilder.accounts({ search: searchQuery })}>
            All Accounts
          </SearchAllResults>
        )}
      </>
    );
  };

  const Apps = () => {
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
        {apps.length > MAX_SEARCH_SUGGESTION_COUNT && (
          <SearchAllResults
            to={urlBuilder.applications({ search: searchQuery })}
          >
            All Apps
          </SearchAllResults>
        )}
      </>
    );
  };

  return (
    <div className='search-group search-accounts'>
      {isUsernameQuery ? (
        <>
          <Accounts />
          <Apps />
        </>
      ) : (
        <>
          <Apps />
          <Accounts />
        </>
      )}
    </div>
  );
};
