import { useSelector } from 'react-redux';

import { activeNetworkSelector } from 'redux/selectors';

export const useHasProofsEndpoint = () => {
  const { hasProofsEndpoint } = useSelector(activeNetworkSelector);

  return Boolean(hasProofsEndpoint);
};
