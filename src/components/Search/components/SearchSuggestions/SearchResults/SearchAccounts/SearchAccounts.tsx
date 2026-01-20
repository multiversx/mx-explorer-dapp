import { useMemo } from 'react';
import { isContract } from '@multiversx/sdk-dapp';
import BigNumber from 'bignumber.js';
import { useSelector } from 'react-redux';

import { useGetSearchQueryType } from 'hooks/search/useGetSearchQueryType';
import { searchSelector } from 'redux/selectors';
import { AccountType } from 'types';
import { SearchAccountsCategory } from './SearchAccountsCategory';
import { SearchAppsCategory } from './SearchAppsCategory';

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
        (a.assets ? -1 : 1) ||
        b.txCount - a.txCount ||
        new BigNumber(b.balance).minus(a.balance).toNumber()
      );
    });

    return [splitAccounts, splitApps];
  }, [account, searchAccounts]);

  if (searchAccounts.length === 0 && !account) {
    return null;
  }

  return (
    <div className='search-group search-accounts'>
      {isUsernameQuery ? (
        <>
          <SearchAccountsCategory accounts={accounts} />
          <SearchAppsCategory apps={apps} />
        </>
      ) : (
        <>
          <SearchAppsCategory apps={apps} />
          <SearchAccountsCategory accounts={accounts} />
        </>
      )}
    </div>
  );
};
