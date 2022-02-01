import * as React from 'react';
import axios from 'axios';
import { analytics } from 'helpers';
import { useGlobalState, useGlobalDispatch } from 'context';
import parseJwt from './parseJwt';

const AxiosInterceptor = ({ children }: { children: React.ReactNode }) => {
  const timeoutRef = React.useRef<any>();
  const {
    activeNetwork: { extrasApi, accessToken: hasAccessToken, delegationApi },
    accessToken,
  } = useGlobalState();
  const dispatch = useGlobalDispatch();
  const [interceptorsReady, setInterceptorsReady] = React.useState(false);
  const [requestId, setRequestId] = React.useState(-1);
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

  const setInterceptors = (newToken: string) => {
    const newRequestId = axios.interceptors.request.use(
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
    setRequestId(newRequestId);
    setResponseInterceptors();
  };

  const fetchToken = () => {
    const instance = axios.create();
    instance
      .get(`***REMOVED***`)
      .then(({ data: newToken }) => {
        dispatch({
          type: 'setAccessToken',
          accessToken: newToken,
        });
        setInterceptors(newToken);
        setInterceptorsReady(true);
      })
      .catch((err) => {
        console.error(err);
        setInterceptorsReady(true);
      });
  };

  const configureAxios = () => {
    if (hasAccessToken) {
      if (!accessToken) {
        fetchToken();
      } else {
        const { exp: tokenTimestamp } = parseJwt(accessToken);
        if (tokenTimestamp !== undefined) {
          const now = Math.floor(Date.now() / 1000);
          const fetchNextTokenSec = tokenTimestamp - now - 60;
          setInterceptors(accessToken);
          setInterceptorsReady(true);
          timeoutRef.current = setTimeout(() => {
            axios.interceptors.request.eject(requestId);
            axios.interceptors.request.eject(responseId);
            fetchToken();
          }, fetchNextTokenSec * 1000);
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
  React.useEffect(configureAxios, [accessToken]);

  return interceptorsReady ? <>{children}</> : null;
};

export default AxiosInterceptor;
