import { useEffect } from 'react';

export const useOutsideClick = (
  ref: any,
  onClickOut: () => void,
  deps: any[] = []
) => {
  useEffect(() => {
    const onClick = ({ target }: any) => {
      if (ref?.contains(target) || !ref || !target) {
        return;
      }

      onClickOut?.();
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, deps);
};
