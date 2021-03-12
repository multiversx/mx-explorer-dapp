import axios from 'axios';
import { ProviderType, ProviderPropsType } from '../helpers';

const api: ProviderType = ({ baseUrl, url, params, timeout }) => {
  return axios.get(`${baseUrl}${url}`, { params, timeout });
};

export default {
  provider: api,
  getStats: ({ baseUrl, timeout }: ProviderPropsType) => {
    return api({
      baseUrl,
      url: `/stats`,
      timeout,
    });
  },
  getNodes: api,
  getShards: ({ baseUrl, timeout }: ProviderPropsType) => {
    return api({
      baseUrl,
      url: `/shards`,
      timeout,
    });
  },
  getAccountDelegation: (props: ProviderPropsType & { proxyUrl: string; address: string }) => {
    const { proxyUrl, address, timeout } = props;
    return axios.get(`${proxyUrl}/accounts/${address}/delegation`, { timeout });
  },
  getAccountStake: (props: ProviderPropsType & { proxyUrl: string; address: string }) => {
    const { proxyUrl, address, timeout } = props;
    return axios.get(`${proxyUrl}/accounts/${address}/stake`, { timeout });
  },
  getEconomics: (props: ProviderPropsType & { proxyUrl: string }) => {
    const { proxyUrl, timeout } = props;
    return axios.get(`${proxyUrl}/economics`, { timeout });
  },
};
