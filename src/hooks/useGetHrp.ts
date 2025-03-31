import { useSelector } from 'react-redux';

import { DEFAULT_HRP } from 'appConstants';
import { activeNetworkSelector } from 'redux/selectors';

export const useGetHrp = () => {
  const { hrp } = useSelector(activeNetworkSelector);

  if (hrp) {
    return hrp;
  }

  return DEFAULT_HRP;
};
