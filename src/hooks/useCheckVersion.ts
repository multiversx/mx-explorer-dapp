import { useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useSelector } from 'react-redux';

import { NEW_VERSION_NOTIFICATION } from 'appConstants';
import { useNotifications } from 'hooks';
import { refreshSelector } from 'redux/selectors/refresh';

export const useCheckVersion = () => {
  const { timestamp } = useSelector(refreshSelector);

  const refreshRate = 60 * 1000;
  const { addNotification } = useNotifications();

  const isMainnetExplorer =
    window.location.origin === 'https://explorer.multiversx.com';
  const explorerVersion = import.meta.env.VITE_APP_CACHE_BUST;
  const explorerVersionUrl = import.meta.env.VITE_APP_VERSION_URL;

  const withinInterval = moment()
    .subtract(refreshRate, 'ms')
    .isAfter(moment(timestamp));

  const checkVersion = () => {
    axios
      .get(`https:${explorerVersionUrl}?${Date.now()}`)
      .then(({ data: latestExplorerVersion }) => {
        if (
          explorerVersion !== undefined &&
          latestExplorerVersion !== undefined
        ) {
          if (explorerVersion !== latestExplorerVersion) {
            addNotification({
              id: NEW_VERSION_NOTIFICATION,
              text: 'A new version of the Explorer is available.',
              dismissable: false,
              priority: 1
            });
          }
        }
      })
      .catch((err) => {
        console.error('Unable to get version', err);
      });
  };

  const useLoop = () => {
    const intervalId = setInterval(() => {
      if (
        !withinInterval &&
        !document.hidden &&
        isMainnetExplorer &&
        explorerVersionUrl
      ) {
        checkVersion();
      }
    }, refreshRate);
    return () => {
      clearInterval(intervalId);
    };
  };

  useEffect(useLoop, []);
};
