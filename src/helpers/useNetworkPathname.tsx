import { useGlobalState } from 'context';
import { useLocation } from 'react-router-dom';

const useNetworkPathname = () => {
  const { pathname: originalPathname } = useLocation();
  const { activeNetworkId } = useGlobalState();
  const pathname = activeNetworkId
    ? originalPathname.replace(`/${activeNetworkId}`, '')
    : originalPathname;
  return pathname;
};

export default useNetworkPathname;
