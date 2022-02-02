import * as React from 'react';
import axios from 'axios';
import moment from 'moment';
import { analytics, storage } from 'helpers';
import { useGlobalState } from 'context';
import parseJwt from './parseJwt';

const AxiosInterceptor = ({ children }: { children: React.ReactNode }) => {
  const timeoutRef = React.useRef<any>();
  const {
    activeNetwork: { extrasApi, accessToken: hasAccessToken, delegationApi },
  } = useGlobalState();

  const [interceptorsReady, setInterceptorsReady] = React.useState(false);
  const [token, setToken] = React.useState<string>(storage.getFromLocal('accessToken'));
  const requestIdRef = React.useRef<number>(-1);
  const [responseId, setResponseId] = React.useState(-1);
  const explorerVersion = process.env.REACT_APP_CACHE_BUST;
  const ignoreList: string[] = [
    '***REMOVED***',
    '//data.elrond.com',
  ];

  if (delegationApi) {
    ignoreList.push(delegationApi);
  }

  const setResponseInterceptors = () => {
    const newResponseId = axios.interceptors.response.use(
      (response) => {
        return response;
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

    setResponseId(newResponseId);
  };

  const setRequestInterceptors = (newToken: string) => {
    axios.interceptors.request.eject(requestIdRef.current);

    requestIdRef.current = axios.interceptors.request.use(
      async (config) => {
        const isIgnored = ignoreList.filter((url) => {
          return config.url && config.url.includes(url);
        });
        if (!isIgnored.length) {
          config.headers = {
            Authorization: `Bearer ${newToken}`,
          };
        }

        return config;
      },
      (error) => {
        Promise.reject(error);
      }
    );
    setResponseInterceptors();
  };

  const fetchToken = () => {
    const instance = axios.create();
    instance
      .get(`***REMOVED***`)
      .then(({ data: newToken }) => {
        const in2Hours = new Date(moment().add(2, 'hours').toDate());
        storage.saveToLocal({
          key: 'accessToken',
          data: newToken,
          expirationDate: in2Hours,
        });

        setToken(newToken);
        setRequestInterceptors(newToken);
        setInterceptorsReady(true);
      })
      .catch((err) => {
        console.error(err);
        setInterceptorsReady(true);
      });
  };

  const configureAxios = () => {
    if (hasAccessToken) {
      if (!token) {
        fetchToken();
      } else {
        const { exp: tokenTimestamp } = parseJwt(token);
        if (tokenTimestamp !== undefined) {
          const now = Math.floor(Date.now() / 1000);
          const fetchNextTokenSec = tokenTimestamp - now - 60;

          if (fetchNextTokenSec > 0 && !interceptorsReady) {
            setRequestInterceptors(token);
            setResponseInterceptors();
            setInterceptorsReady(true);
          }

          timeoutRef.current = setTimeout(() => {
            axios.interceptors.request.eject(responseId);
            fetchToken();
          }, fetchNextTokenSec * 1000);
        } else {
          fetchToken();
        }
      }
    } else {
      setResponseInterceptors();
      setInterceptorsReady(true);
    }

    return () => {
      clearTimeout(timeoutRef.current);
    };
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(configureAxios, [token]);

  return interceptorsReady ? <>{children}</> : null;
};

export default AxiosInterceptor;
