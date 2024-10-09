import { RefObject, useEffect } from 'react';

import { useGetTransactionUrlHashParams } from 'hooks';

export const useScrollToTransactionSection = (
  ref?: RefObject<HTMLDivElement>
) => {
  const { id } = useGetTransactionUrlHashParams();

  useEffect(() => {
    setTimeout(() => {
      if (id && ref?.current && ref.current !== null) {
        ref.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'start'
        });
      }
    }, 200);
  }, [id]);
};
