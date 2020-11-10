import * as React from 'react';
import axios from 'axios';

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
          try {
            const erdAddressRegex = new RegExp(/erd1\w+/, 'g');
            const request = reqUrl.replace(erdAddressRegex, 'erd1...');

            if ((window as any).ga) {
              (window as any).ga('send', 'event', 'failed-request', request);
            }
          } catch (err) {
            console.error(err);
          }
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
