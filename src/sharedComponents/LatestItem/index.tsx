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
  const [internalIsNew, setInternalIsNew] = React.useState<boolean | undefined>();
  const expandDuration = 800;
  const totalAnimationTime = maxNewItems * expandDuration;
  const itemAnimationDelay = totalAnimationTime - expandDuration * index;

  React.useEffect(() => {
    if (isNew) {
      setTimeout(() => {
        setInternalIsNew(false);
      }, itemAnimationDelay);
    }
  }, []);

  return (
    <div
      className={`latest-item ${index > 4 ? 'hide-sm' : ''} ${
        isNew && internalIsNew === undefined ? 'isNew' : ''
      }`}
    >
      {children}
    </div>
  );
};

export default LatestItem;
