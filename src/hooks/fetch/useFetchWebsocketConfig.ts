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
      dispatch(
        changeStateNetwork({
          ...activeNetwork,
          updatesWebsocketUrl: `https://${data.url}`
        })
      );
    }

    return { data, success };
  };

  return fetchWebsocketConfig;
};
