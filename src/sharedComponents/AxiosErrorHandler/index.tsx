import * as React from 'react';
import axios from 'axios';
import { analytics } from 'helpers';

const AxiosErrorHandler = ({ children }: { children: React.ReactNode }) => {
  const [initialize, setInitialize] = React.useState(false);
  const ignoreList: string[] = [];

  const intiAxios = () => {
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        const reqUrl = error.config.url;
        const logError = reqUrl && !ignoreList.some((url) => reqUrl.indexOf(url) > -1);

        if (logError) {
          analytics.send({ action: 'failed-request', label: reqUrl });
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
