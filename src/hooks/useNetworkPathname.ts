import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { activeNetworkSelector } from 'redux/selectors';

export const useNetworkPathname = () => {
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const { pathname: originalPathname } = useLocation();

  const pathname = activeNetworkId
    ? originalPathname.replace(`/${activeNetworkId}`, '')
    : originalPathname;
  return pathname;
};
