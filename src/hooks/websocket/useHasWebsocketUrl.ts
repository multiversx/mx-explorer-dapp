import { useSelector } from 'react-redux';
import { activeNetworkSelector } from 'redux/selectors';

export const useHasWebsocketUrl = () => {
  const { updatesWebsocketUrl } = useSelector(activeNetworkSelector);

  return Boolean(updatesWebsocketUrl);
};
