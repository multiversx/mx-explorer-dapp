import { useEffect } from 'react';
import { LibraryConfig } from '@multiversx/sdk-core/out';
import { useSelector } from 'react-redux';

import { DEFAULT_HRP } from 'appConstants';
import { activeNetworkSelector } from 'redux/selectors';

export const useSetDappConfig = () => {
  const activeNetwork = useSelector(activeNetworkSelector);

  useEffect(() => {
    if (!activeNetwork.hrp) {
      return;
    }

    if (activeNetwork.hrp !== DEFAULT_HRP) {
      // set the default HRP in sdk-js
      try {
        LibraryConfig.DefaultAddressHrp = activeNetwork.hrp;
      } catch {}
    }
  }, [activeNetwork]);
};
