import React from 'react';
import axios from 'axios';
import moment from 'moment';

import { useSelector } from 'react-redux';
import { useNotifications } from 'helpers';

import { interfaceSelector } from 'redux/selectors';

export const useCheckVersion = () => {
  const {
    refresh: { timestamp }
  } = useSelector(interfaceSelector);

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
      .get(
        `https:***REMOVED***?${Date.now()}`
      )
      .then(({ data: latestExplorerVersion }) => {
        if (
          explorerVersion !== undefined &&
          latestExplorerVersion !== undefined
        ) {
          if (explorerVersion !== latestExplorerVersion) {
            addNotification({
              id: 'newExplorerVersion',
              text: (
                <div className='d-flex justify-content-between align-items-center'>
                  A new version of the Explorer is available.
                  <a
                    href='/#'
                    onClick={(e: React.MouseEvent) => {
                      e.preventDefault();
                      window.location.reload();
                    }}
                    className='ms-1 text-black'
                  >
                    <u>Reload</u>
                  </a>
                </div>
              ),
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
  React.useEffect(useLoop, []);
};
