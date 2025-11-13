import { formatHerotag } from 'helpers';
import { useAdapter } from 'hooks';
import { SearchResponseType } from 'types';
import { useSearchSingleResponse } from './useSearchSingleResponse';

export const useSearch = (hash: string) => {
  const { getTokens, getCollections, getUsername, getAccounts } = useAdapter();
  const searchSingleResponse = useSearchSingleResponse(hash);

  const searchHash = String(hash).trim();
  const defaultQueryParams = { size: 10 };

  const search = async (): Promise<SearchResponseType> => {
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

    const foundTokens = tokensResponse?.data && tokensResponse.data.length > 0;
    const foundCollections =
      collectionsResponse?.data && collectionsResponse.data.length > 0;
    const foundAccounts =
      accountsResponse?.data && accountsResponse.data.length > 0;

    return {
      ...(foundTokens ? { tokens: tokensResponse?.data } : {}),
      ...(foundCollections ? { collections: collectionsResponse?.data } : {}),
      ...(foundAccounts ? { accounts: accountsResponse?.data } : {}),
      ...(usernameResponse?.data?.address
        ? { account: usernameResponse?.data }
        : {})
    };
  };

  return { search };
};
