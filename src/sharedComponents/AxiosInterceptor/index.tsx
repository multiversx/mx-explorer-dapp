import * as React from 'react';
import axios from 'axios';
import moment from 'moment';
import { storage, analytics } from 'helpers';
import { useGlobalState } from 'context';
import parseJwt from './parseJwt';

const AxiosInterceptor = ({ children }: { children: React.ReactNode }) => {
  const promiseRef = React.useRef<Promise<string | undefined>>();
  const explorerVersion = process.env.REACT_APP_CACHE_BUST;

  const {
    activeNetwork: { extrasApi, accessToken: hasAccessToken, delegationApi },
  } = useGlobalState();

  const ignoreList: string[] = [
    '***REMOVED***',
    '//data.elrond.com',
  ];

  if (delegationApi) {
    ignoreList.push(delegationApi);
  }

  const getStorageAccessToken = () => {
    const storageAccessToken: string | undefined = storage.getFromLocal('accessToken');

    if (storageAccessToken) {
      const { exp: tokenTimestamp } = parseJwt(storageAccessToken);

      if (tokenTimestamp !== undefined) {
        const now = Math.floor(Date.now() / 1000);
        const expired = tokenTimestamp - now < 120; // expired or expires in 2m

        if (!expired) {
          return storageAccessToken;
        }
      }
    }

    return undefined;
  };

  const fetchToken = async () => {
    const instance = axios.create();
    try {
      const { data } = await instance.get(`***REMOVED***`);
      const newToken: string = data;

      const in2Hours = new Date(moment().add(2, 'hours').toDate());
      storage.saveToLocal({
        key: 'accessToken',
        data: newToken,
        expirationDate: in2Hours,
      });

      return newToken;
    } catch {
      return undefined;
    }
  };

  const getAccessToken = async () => {
    if (promiseRef.current) {
      return promiseRef.current;
    } else {
      const storageAccessToken = getStorageAccessToken();
      if (storageAccessToken) {
        return storageAccessToken;
      } else {
        promiseRef.current = fetchToken();
        return promiseRef.current;
      }
    }
  };

  axios.interceptors.request.use(
    async (config) => {
      if (hasAccessToken) {
        const accessToken = await getAccessToken();
        promiseRef.current = undefined;

        const isIgnored = ignoreList.filter((url) => {
          return config.url && config.url.includes(url);
        });
        if (accessToken && !isIgnored.length) {
          config.headers = {
            Authorization: `Bearer ${accessToken}`,
          };
        }
      }

      return config;
    },
    (error) => {
      let reqUrl = error.config.url;
      if (error.config.params) {
        const queryString = new URLSearchParams(error.config.params);
        reqUrl += `?${queryString.toString()}`;
      }

      const logError = reqUrl && !ignoreList.some((url) => reqUrl.indexOf(url) > -1);

      if (explorerVersion !== undefined && logError) {
        analytics.sendEvent({
          action: 'failed-request',
          label: reqUrl,
          explorerVersion,
        });
      }

      return Promise.reject(error);
    }
  );

  return <>{children}</>;
};

export default AxiosInterceptor;
