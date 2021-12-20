import React from 'react';
import axios from 'axios';
import moment from 'moment';
import { useGlobalState, useGlobalDispatch } from 'context';
import { refreshRate } from 'appConfig';
import { useNotifications } from 'helpers';

export default function useLoopManager() {
  const {
    refresh: { timestamp },
  } = useGlobalState();
  const dispatch = useGlobalDispatch();
  const { addNotification } = useNotifications();

  const isMainnetExplorer = window.location.origin === 'https://explorer.elrond.com';
  const explorerVersion = process.env.REACT_APP_CACHE_BUST;

  const withinInterval = moment().subtract(refreshRate, 'ms').isAfter(moment(timestamp));

  const checkVersion = () => {
    axios
      .get('https:***REMOVED***')
      .then(({ data }) => {
        const latestExplorerVersion = data;
        if (explorerVersion !== undefined && latestExplorerVersion !== undefined) {
          if (explorerVersion !== latestExplorerVersion) {
            addNotification({
              id: 'newExplorerVersion',
              text: (
                <div className="d-flex justify-content-between align-items-center">
                  A new version of the Explorer is available.
                  <a
                    href="/#"
                    onClick={(e: React.MouseEvent) => {
                      e.preventDefault();
                      window.location.reload();
                    }}
                    className="ml-1 text-black"
                  >
                    <u>Reload</u>
                  </a>
                </div>
              ),
              dismissable: false,
              priority: 1,
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
      if (!withinInterval && !document.hidden) {
        dispatch({
          type: 'triggerTick',
        });
        if (isMainnetExplorer) {
          checkVersion();
        }
      }
    }, refreshRate);
    return () => {
      clearInterval(intervalId);
    };
  };

  React.useEffect(useLoop, []);
}
