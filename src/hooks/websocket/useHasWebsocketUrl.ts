import { useSelector } from 'react-redux';
import { activeNetworkSelector } from 'redux/selectors';

export const useHasWebsocketUrl = () => {
  const { updatesWebsocketUrl, hasWebsocket } = useSelector(
    activeNetworkSelector
  );

  return Boolean(updatesWebsocketUrl) && hasWebsocket !== false;
};
