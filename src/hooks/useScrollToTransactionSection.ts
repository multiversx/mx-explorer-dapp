import { RefObject, useEffect } from 'react';

import { useGetTransactionUrlHashParams } from 'hooks';

export const useScrollToTransactionSection = (
  ref?: RefObject<HTMLDivElement | null>
) => {
  const { id } = useGetTransactionUrlHashParams();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (id && ref?.current && ref.current !== null) {
        ref.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'start'
        });
      }
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [id]);
};
