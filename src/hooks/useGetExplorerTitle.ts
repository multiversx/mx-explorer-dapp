import { useSelector } from 'react-redux';

import { capitalize } from 'helpers';
import { activeNetworkSelector } from 'redux/selectors';

export const useGetExplorerTitle = () => {
  const { id } = useSelector(activeNetworkSelector);
  const customLinkPrefix = process.env.VITE_APP_SHARE_PREFIX
    ? `${capitalize(
        String(process.env.VITE_APP_SHARE_PREFIX).replace('-', ' ')
      )}`
    : '';
  const explorerTitle =
    id !== 'mainnet' && customLinkPrefix
      ? `${customLinkPrefix} Explorer`
      : 'Explorer';

  return explorerTitle;
};
