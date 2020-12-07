import * as React from 'react';
import axios from 'axios';
import { analytics } from 'helpers';

const AxiosErrorHandler = ({ children }: { children: React.ReactNode }) => {
  const [initialize, setInitialize] = React.useState(false);
  const explorerVersion = process.env.REACT_APP_CACHE_BUST;
  const ignoreList: string[] = [];

  const intiAxios = () => {
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        const reqUrl = error.config.url;
        const logError = reqUrl && !ignoreList.some((url) => reqUrl.indexOf(url) > -1);

        if (explorerVersion !== undefined && logError) {
          analytics.sendEvent({ action: 'failed-request', label: reqUrl, explorerVersion });
        }
        return Promise.reject(error);
      }
    );
    setInitialize(true);
  };

  React.useEffect(intiAxios, []);
  return initialize ? <>{children}</> : null;
};

export default AxiosErrorHandler;
