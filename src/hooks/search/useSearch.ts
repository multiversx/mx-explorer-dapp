import { useDispatch, useSelector } from 'react-redux';

import { formatHerotag } from 'helpers';
import { useAdapter } from 'hooks';
import { searchSelector } from 'redux/selectors';
import { setSearch } from 'redux/slices';
import { SearchResponseType } from 'types';
import { useSearchSingleResponse } from './useSearchSingleResponse';

export const useSearch = (hash: string) => {
  const dispatch = useDispatch();
  const { searchQuery, isDataReady } = useSelector(searchSelector);
  const { getTokens, getCollections, getNfts, getUsername, getAccounts } =
    useAdapter();
  const searchSingleResponse = useSearchSingleResponse(hash);

  const searchHash = String(hash).trim();
  const defaultQueryParams = { size: 10 };

  const fetchResults = async (): Promise<SearchResponseType> => {
    if (searchHash === undefined) {
      return {};
    }

    const singleResponse = await searchSingleResponse();
    if (Object.keys(singleResponse).length > 0) {
      return singleResponse;
    }

    const [
      tokensResponse,
      collectionsResponse,
      nftsResponse,
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
      getNfts({
        search: searchHash,
        excludeMetaESDT: true,
        ...defaultQueryParams
      }),
      getAccounts({
        search: searchHash,
        withTxCount: true
      }),
      getUsername(formatHerotag(searchHash))
    ]);

    const foundTokens = tokensResponse?.data && tokensResponse.data.length > 0;
    const foundCollections =
      collectionsResponse?.data && collectionsResponse.data.length > 0;
    const foundNfts = nftsResponse?.data && nftsResponse.data.length > 0;
    const foundAccounts =
      accountsResponse?.data && accountsResponse.data.length > 0;

    return {
      ...(foundTokens ? { tokens: tokensResponse?.data } : {}),
      ...(foundCollections ? { collections: collectionsResponse?.data } : {}),
      ...(foundNfts ? { nfts: nftsResponse?.data } : {}),
      ...(foundAccounts ? { accounts: accountsResponse?.data } : {}),
      ...(usernameResponse?.data?.address
        ? { account: usernameResponse?.data }
        : {})
    };
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
