import { useCallback, useEffect, useRef } from 'react';

export const useAbortSignal = () => {
  const controllerRef = useRef<AbortController | undefined>(undefined);

  useEffect(
    () => () => {
      controllerRef.current?.abort();
    },
    []
  );

  return useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = new AbortController();

    return controllerRef.current.signal;
  }, []);
};
