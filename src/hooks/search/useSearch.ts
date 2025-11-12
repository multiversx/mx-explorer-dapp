import { useState } from 'react';
import { formatHerotag } from 'helpers';
import { useAdapter } from 'hooks';
import { SearchResponseType } from 'types';
import { useSearchSingleResponse } from './useSearchSingleResponse';

export const useSearch = (hash: string) => {
  const { getTokens, getCollections, getUsername, getAccounts } = useAdapter();
  const searchSingleResponse = useSearchSingleResponse(hash);

  const [isSearching, setIsSearching] = useState<undefined | boolean>();

  const searchHash = String(hash).trim();
  const defaultQueryParams = { size: 10 };

  const search = async (): Promise<SearchResponseType> => {
    if (searchHash === undefined) {
      return {};
    }
    setIsSearching(true);

    const singleResponse = await searchSingleResponse();
    if (Object.keys(singleResponse).length > 0) {
      return singleResponse;
    }

    const [
      tokensResponse,
      collectionsResponse,
      accountsResponse,
      usernameResponse
    ] = await Promise.all([
      getTokens({
        search: searchHash,
        includeMetaESDT: true,
        ...defaultQueryParams
      }),
      getCollections({
        search: searchHash,
        excludeMetaESDT: true,
        ...defaultQueryParams
      }),
      getAccounts({
        search: searchHash
      }),
      getUsername(formatHerotag(searchHash))
    ]);

    if (tokensResponse?.data) {
      return { tokens: tokensResponse?.data };
    }
    if (collectionsResponse?.data) {
      return { collections: collectionsResponse?.data };
    }
    if (accountsResponse?.data) {
      return { accounts: accountsResponse?.data };
    }
    if (usernameResponse?.data?.hash) {
      return { account: usernameResponse?.data };
    }

    return {};
  };

  return { search, isSearching, setIsSearching };
};
