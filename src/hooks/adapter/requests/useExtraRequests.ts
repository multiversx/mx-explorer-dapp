import { useMemo } from 'react';

import { ExchangePriceRangeEnum } from 'types';
import { AxiosParamsApiType } from 'types/adapter.types';

import { useAdapterConfig } from '../useAdapterConfig';

export const useExtraRequests = () => {
  const { provider } = useAdapterConfig();

  return useMemo(
    () => ({
      /* xExchange */
      getExchangeTokenPriceHistory: ({
        identifier,
        range = ExchangePriceRangeEnum.hourly,
        signal
      }: {
        identifier: string;
        range?: ExchangePriceRangeEnum;
      } & AxiosParamsApiType) => {
        if (range === ExchangePriceRangeEnum.daily) {
          return provider({
            url: `/mex/tokens/prices/daily/${identifier}`,
            signal
          });
        }
        return provider({
          url: `/mex/tokens/prices/hourly/${identifier}`,
          signal
        });
      }
    }),
    [provider]
  );
};
