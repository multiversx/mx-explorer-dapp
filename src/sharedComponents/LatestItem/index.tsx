import * as React from 'react';

const LatestItem = ({
  children,
  isNew,
  index,
  maxNewItems,
}: {
  children: React.ReactNode;
  isNew: boolean | undefined;
  index: number;
  maxNewItems: number;
}) => {
  const ref = React.useRef(null);
  const [internalIsNew, setInternalIsNew] = React.useState<boolean | undefined>();
  const expandDuration = 600;
  const totalAnimationTime = maxNewItems * expandDuration;
  const itemAnimationDelay = totalAnimationTime - expandDuration * index;

  React.useEffect(() => {
    if (isNew) {
      setTimeout(() => {
        if (ref.current !== null) {
          setInternalIsNew(false);
        }
      }, itemAnimationDelay);
    }
  }, []);

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

export default LatestItem;
