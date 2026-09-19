import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { formatHerotag } from 'helpers';
import { useAdapter, useIsMainnet } from 'hooks';
import { searchSelector } from 'redux/selectors';
import { setSearch } from 'redux/slices';
import { SearchResponseType, SortOrderEnum } from 'types';
import { useSearchSingleResponse } from './useSearchSingleResponse';

export const useSearch = (hash: string) => {
  const controllerRef = useRef<any | null>(null);
  const dispatch = useDispatch();
  const isMainnet = useIsMainnet();
  const { searchQuery, isDataReady } = useSelector(searchSelector);
  const {
    getTokens,
    getCollections,
    getNfts,
    getNodes,
    getUsername,
    getAccounts
  } = useAdapter();
  const searchSingleResponse = useSearchSingleResponse(hash);

  const searchHash = String(hash).trim();
  const defaultQueryParams = { size: 6 };
  const accountSorting = {
    sort: 'transfersLast24h',
    order: SortOrderEnum.desc
  };

  const fetchResults = async (): Promise<SearchResponseType> => {
    if (searchHash === undefined) {
      return {};
    }

    const singleResponse = await searchSingleResponse();
    if (Object.keys(singleResponse).length > 0) {
      return singleResponse;
    }

    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    controllerRef.current = new AbortController();

    try {
      const signal = controllerRef.current.signal;
      const [
        tokensResponse,
        collectionsResponse,
        nftsResponse,
        nodesResponse,
        accountsResponse,
        usernameResponse
      ] = await Promise.all([
        getTokens({
          signal,
          search: searchHash,
          includeMetaESDT: true,
          ...defaultQueryParams
        }),
        getCollections({
          signal,
          search: searchHash,
          excludeMetaESDT: true,
          ...defaultQueryParams
        }),
        getNfts({
          signal,
          search: searchHash,
          excludeMetaESDT: true,
          ...defaultQueryParams
        }),
        getNodes({
          signal,
          search: searchHash,
          withIdentityInfo: true,
          ...defaultQueryParams
        }),
        getAccounts({
          signal,
          search: searchHash,
          withAssets: true,
          withTxCount: true,
          ...(isMainnet ? accountSorting : {})
        }),
        getUsername(formatHerotag(searchHash), { signal })
      ]);

      const foundTokens =
        tokensResponse?.data && tokensResponse.data.length > 0;
      const foundCollections =
        collectionsResponse?.data && collectionsResponse.data.length > 0;
      const foundNfts = nftsResponse?.data && nftsResponse.data.length > 0;
      const foundNodes = nodesResponse?.data && nodesResponse.data.length > 0;
      const foundAccounts =
        accountsResponse?.data && accountsResponse.data.length > 0;

      return {
        ...(foundTokens ? { tokens: tokensResponse?.data } : {}),
        ...(foundCollections ? { collections: collectionsResponse?.data } : {}),
        ...(foundNfts ? { nfts: nftsResponse?.data } : {}),
        ...(foundNodes ? { nodes: nodesResponse?.data } : {}),
        ...(foundAccounts ? { accounts: accountsResponse?.data } : {}),
        ...(usernameResponse?.data?.address
          ? { account: usernameResponse?.data }
          : {})
      };
    } catch (err: any) {
      if (err.name === 'CanceledError') {
        console.info('Search cancelled');
        return {};
      } else {
        console.error('Encountered an error searching for: ', hash);
        return {};
      }
    }
  };

  const search = async () => {
    if (
      isDataReady &&
      searchHash &&
      searchQuery &&
      searchHash === searchQuery
    ) {
      return;
    }

    dispatch(
      setSearch({ search: {}, searchQuery: searchHash, isDataReady: false })
    );
    const results = await fetchResults();
    dispatch(
      setSearch({ search: results, searchQuery: searchHash, isDataReady: true })
    );
    return results;
  };

  return { search };
};
