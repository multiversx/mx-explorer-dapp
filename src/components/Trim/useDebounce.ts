import { useState, useEffect } from 'react';

export const useDebounce = (value: any, timeout: number) => {
  const [state, setState] = useState(value);

  const effect = () => {
    const handler = setTimeout(() => setState(value), timeout);

    return () => clearTimeout(handler);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, [value]);

  return state;
};
