import * as React from 'react';

const LatestItem = ({
  children,
  isNew,
  index,
}: {
  children: React.ReactNode;
  isNew: boolean | undefined;
  index: number;
}) => {
  const [internalIsNew, setInternalIsNew] = React.useState<boolean | undefined>();
  const max = 8 * 600;

  React.useEffect(() => {
    if (isNew) {
      setTimeout(() => {
        setInternalIsNew(false);
      }, max - 600 * index);
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
