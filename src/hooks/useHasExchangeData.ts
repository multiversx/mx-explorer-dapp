import { useSelector } from 'react-redux';
import { activeNetworkSelector } from 'redux/selectors';

export const useHasExchangeData = () => {
  const { hasExchangeData } = useSelector(activeNetworkSelector);

  return Boolean(hasExchangeData);
};
