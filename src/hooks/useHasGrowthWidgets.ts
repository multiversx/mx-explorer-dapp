import { useSelector } from 'react-redux';
import { activeNetworkSelector } from 'redux/selectors';

export const useHasGrowthWidgets = () => {
  const { accessToken: hasAccessToken, growthApi } = useSelector(
    activeNetworkSelector
  );

  return Boolean(hasAccessToken && growthApi);
};
