import { useGlobalState } from 'context';
import { useLocation } from 'react-router-dom';

export const useNetworkPathname = () => {
  const { pathname: originalPathname } = useLocation();
  const { activeNetworkId } = useGlobalState();
  const pathname = activeNetworkId
    ? originalPathname.replace(`/${activeNetworkId}`, '')
    : originalPathname;
  return pathname;
};
