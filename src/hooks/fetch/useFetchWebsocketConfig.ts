import { useDispatch, useSelector } from 'react-redux';

import { useAdapter } from 'hooks';
import { activeNetworkSelector } from 'redux/selectors';
import { changeNetwork as changeStateNetwork } from 'redux/slices';

let currentRequest: any = null;

export const useFetchWebsocketConfig = () => {
  const dispatch = useDispatch();
  const activeNetwork = useSelector(activeNetworkSelector);
  const { getWebsocketConfig } = useAdapter();

  const getWebsocketConfigOnce = () => {
    if (currentRequest) {
      return currentRequest;
    }

    const requestPromise = new Promise(async (resolve, reject) => {
      try {
        const response = await getWebsocketConfig();
        resolve(response);
      } catch (error) {
        reject(error);
      } finally {
        currentRequest = null;
      }
    });

    currentRequest = requestPromise;
    return requestPromise;
  };

  const fetchWebsocketConfig = async () => {
    const { data, success } = await getWebsocketConfigOnce();

    if (data?.url && success) {
      const updatesWebsocketUrl = String(data.url).startsWith('https://')
        ? data.url
        : `https://${data.url}`;
      dispatch(
        changeStateNetwork({
          ...activeNetwork,
          updatesWebsocketUrl
        })
      );
    }

    return { data, success };
  };

  return fetchWebsocketConfig;
};
