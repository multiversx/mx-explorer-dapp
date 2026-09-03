import React, { useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';

import { SUPERNOVA_REFRESH_RATE } from 'appConstants';

export interface LatestItemUIType {
  children: React.ReactNode;
  isNew: boolean | undefined;
  index: number;
  totalItems: number;

  refreshRate?: number;
}

export const LatestItem = ({
  children,
  isNew,
  index,
  totalItems,
  refreshRate
}: LatestItemUIType) => {
  const ref = useRef(null);
  const isSupernova = refreshRate === SUPERNOVA_REFRESH_RATE;
  const [internalIsNew, setInternalIsNew] = useState<boolean | undefined>();

  const itemAnimationDelay = useMemo(() => {
    const expandDuration = isSupernova ? 100 : 600;
    const totalAnimationTime = totalItems * expandDuration;
    return totalAnimationTime - expandDuration * index;
  }, [totalItems, index, isSupernova]);

  useEffect(() => {
    if (!isNew) {
      return;
    }

    const timeoutId = setTimeout(() => {
      if (ref.current !== null) {
        setInternalIsNew(false);
      }
    }, itemAnimationDelay);

    return () => clearTimeout(timeoutId);
  }, [isNew, itemAnimationDelay]);

  return (
    <div
      ref={ref}
      className={classNames('latest-item', {
        'hide-sm': index > 4,
        isNew: isNew && internalIsNew === undefined,
        fast: isSupernova
      })}
    >
      {children}
    </div>
  );
};
