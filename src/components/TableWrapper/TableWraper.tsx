import React, { useEffect, useRef, useState } from 'react';
import { Loader } from 'components';

export interface TableWrapperType {
  dataChanged?: boolean;
  children?: React.ReactNode;
}

export const TableWrapper = ({
  dataChanged = false,
  children
}: TableWrapperType) => {
  const timeoutRef = useRef<any>();
  const [isHidden, setIsHidden] = useState<boolean>(true);

  const hide = () => {
    timeoutRef.current = setTimeout(() => {
      setIsHidden(true);
    }, 300);

    return () => {
      clearTimeout(timeoutRef.current);
    };
  };

  useEffect(() => {
    setIsHidden(false);
    if (!dataChanged) {
      hide();
    }
  }, [dataChanged]);

  return (
    <div className='table-wrapper animated-list'>
      <div
        className={`overlay ${dataChanged ? '' : 'transparent'} ${
          isHidden ? 'd-none' : ''
        }`}
      >
        <Loader />
      </div>
      {children}
    </div>
  );
};
