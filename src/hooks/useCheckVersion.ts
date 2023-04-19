import React, { useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useSelector } from 'react-redux';

import { APP_VERSION_URL } from 'appConstants';
import { useNotifications } from 'hooks';
import { refreshSelector } from 'redux/selectors/refresh';

export const useCheckVersion = () => {
  const { timestamp } = useSelector(refreshSelector);

  const refreshRate = 60 * 1000;
  const { addNotification } = useNotifications();

  const isMainnetExplorer =
    window.location.origin === 'https://explorer.multiversx.com';
  const explorerVersion = process.env.REACT_APP_CACHE_BUST;

  const withinInterval = moment()
    .subtract(refreshRate, 'ms')
    .isAfter(moment(timestamp));

  const checkVersion = () => {
    axios
      .get(`https:${APP_VERSION_URL}?${Date.now()}`)
      .then(({ data: latestExplorerVersion }) => {
        if (
          explorerVersion !== undefined &&
          latestExplorerVersion !== undefined
        ) {
          if (explorerVersion !== latestExplorerVersion) {
            addNotification({
              id: 'newExplorerVersion',
              text: 'A new version of the Explorer is available.',
              dismissable: false,
              priority: 1
            });
          }
        }
      })
      .catch((err) => {
        console.error('Unable to get version');
      });
  };

  const useLoop = () => {
    const intervalId = setInterval(() => {
      if (!withinInterval && !document.hidden && isMainnetExplorer) {
        checkVersion();
      }
    }, refreshRate);
    return () => {
      clearInterval(intervalId);
    };
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(useLoop, []);
};
