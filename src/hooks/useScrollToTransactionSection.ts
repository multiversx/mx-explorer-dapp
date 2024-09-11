import { useEffect } from 'react';

import { useGetTransactionUrlHashParams } from 'hooks';

export const useScrollToTransactionSection = (
  ref?: React.RefObject<HTMLDivElement>
) => {
  const { hashId } = useGetTransactionUrlHashParams();

  useEffect(() => {
    setTimeout(() => {
      if (hashId && ref?.current && ref.current !== null) {
        ref.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'start'
        });
      }
    }, 200);
  }, [hashId]);
};
