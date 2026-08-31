import React, { useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { activeNetworkSelector } from 'redux/selectors';

export const LatestItem = ({
  children,
  isNew,
  index,
  totalItems
}: {
  children: React.ReactNode;
  isNew: boolean | undefined;
  index: number;
  totalItems: number;
}) => {
  const ref = useRef(null);
  const { refreshRate } = useSelector(activeNetworkSelector);
  const isSupernova = refreshRate === 600;
  const [internalIsNew, setInternalIsNew] = useState<boolean | undefined>();

  const itemAnimationDelay = useMemo(() => {
    const expandDuration = isSupernova ? 100 : 600;
    const totalAnimationTime = totalItems * expandDuration;
    return totalAnimationTime - expandDuration * index;
  }, [refreshRate, totalItems, isSupernova]);

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
