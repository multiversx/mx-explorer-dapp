import { useSelector } from 'react-redux';

import { activeNetworkSelector } from 'redux/selectors';

export const useIsSovereign = () => {
  const { isSovereign } = useSelector(activeNetworkSelector);

  return Boolean(isSovereign);
};
