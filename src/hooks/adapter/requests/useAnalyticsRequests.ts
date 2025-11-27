import { useSelector } from 'react-redux';

import { activeNetworkSelector } from 'redux/selectors';
import { AxiosParamsApiType } from 'types/adapter.types';

import { useAdapterConfig } from '../useAdapterConfig';

export const useAnalyticsRequests = () => {
  const { growthApi } = useSelector(activeNetworkSelector);
  const { provider } = useAdapterConfig();

  return {
    // Growth Charts

    getAnalyticsChart: (
      url: string,
      { signal, timeout }: AxiosParamsApiType = {}
    ) => provider({ baseUrl: growthApi, url, signal, timeout }),

    getAnalyticsChartList: ({ signal, timeout }: AxiosParamsApiType = {}) =>
      provider({
        baseUrl: growthApi,
        url: '/explorer/analytics',
        signal,
        timeout
      }),

    getGrowthWidget: (
      url: string,
      { signal, timeout }: AxiosParamsApiType = {}
    ) =>
      provider({
        baseUrl: `${growthApi}/explorer/widgets`,
        url,
        signal,
        timeout
      }),

    getGrowthHeaders: (
      url: string,
      { signal, timeout }: AxiosParamsApiType = {}
    ) =>
      provider({
        baseUrl: `${growthApi}/explorer/headers`,
        url,
        signal,
        timeout
      })
  };
};
