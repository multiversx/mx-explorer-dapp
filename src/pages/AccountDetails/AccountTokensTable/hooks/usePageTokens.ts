import { useMemo } from 'react';

import { getItemsPage } from 'helpers';
import { useGetPage } from 'hooks';
import { ProcessedTokenType } from '../helpers';

export const usePageTokens = (accountTokens: ProcessedTokenType[]) => {
  const { page, size } = useGetPage();

  return useMemo(() => {
    const processedTokens = getItemsPage({
      items: accountTokens,
      currentPage: page,
      itemsPerPage: size
    });

    return processedTokens;
  }, [accountTokens, page, size]);
};
