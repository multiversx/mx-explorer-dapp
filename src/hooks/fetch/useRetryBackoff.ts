import { useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';

import { getRetryDelay } from 'helpers';
import { activeNetworkSelector } from 'redux/selectors';

export const useRetryBackoff = () => {
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);

  const failedRequestsRef = useRef(0);
  const retryAtRef = useRef(0);

  useEffect(() => {
    failedRequestsRef.current = 0;
    retryAtRef.current = 0;
  }, [activeNetworkId]);

  return useMemo(
    () => ({
      isBackingOff: () => Date.now() < retryAtRef.current,
      trackResult: (success: boolean) => {
        failedRequestsRef.current = success ? 0 : failedRequestsRef.current + 1;
        retryAtRef.current = success
          ? 0
          : Date.now() + getRetryDelay(failedRequestsRef.current);
      }
    }),
    []
  );
};
