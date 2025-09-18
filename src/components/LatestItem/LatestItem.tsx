import React, { useEffect, useRef, useState } from 'react';

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
  const [internalIsNew, setInternalIsNew] = useState<boolean | undefined>();
  const expandDuration = 120;
  const totalAnimationTime = totalItems * expandDuration;
  const itemAnimationDelay = totalAnimationTime - expandDuration * index;

  useEffect(() => {
    if (isNew) {
      setTimeout(() => {
        if (ref.current !== null) {
          setInternalIsNew(false);
        }
      }, itemAnimationDelay);
    }
  }, [isNew, itemAnimationDelay]);

  return (
    <div
      ref={ref}
      className={`latest-item ${index > 4 ? 'hide-sm' : ''} ${
        isNew && internalIsNew === undefined ? 'isNew' : ''
      }`}
    >
      {children}
    </div>
  );
};
