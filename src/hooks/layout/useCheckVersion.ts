import { useEffect } from 'react';
import axios from 'axios';

import {
  LONG_POOLING_REFRESH_RATE,
  NEW_VERSION_NOTIFICATION
} from 'appConstants';
import { useNotifications } from 'hooks';

export const useCheckVersion = () => {
  const { addNotification } = useNotifications();

  const isMainnetExplorer =
    window.location.origin === 'https://explorer.multiversx.com';
  const explorerVersion = import.meta.env.VITE_APP_CACHE_BUST;
  const explorerVersionUrl = import.meta.env.VITE_APP_VERSION_URL;

  const checkVersion = () => {
    axios
      .get(`https:${explorerVersionUrl}?${Date.now()}`)
      .then(({ data: latestExplorerVersion }) => {
        if (
          latestExplorerVersion &&
          explorerVersion !== latestExplorerVersion
        ) {
          addNotification({
            id: NEW_VERSION_NOTIFICATION,
            text: 'A new version of the Explorer is available.',
            dismissable: false,
            priority: 1
          });
        }
      })
      .catch((err) => {
        console.error('Unable to get version', err);
      });
  };

  useEffect(() => {
    if (!isMainnetExplorer || !explorerVersionUrl || document.hidden) {
      return;
    }

    const intervalId = setInterval(checkVersion, LONG_POOLING_REFRESH_RATE);
    return () => {
      clearInterval(intervalId);
    };
  }, []);
};
