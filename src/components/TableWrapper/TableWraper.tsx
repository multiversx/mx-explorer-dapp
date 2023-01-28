import React from 'react';
import { Loader } from 'components';

export interface TableWrapperType {
  dataChanged?: boolean;
  children?: React.ReactNode;
}

export const TableWrapper = ({
  dataChanged = false,
  children
}: TableWrapperType) => {
  return (
    <div className='table-wrapper animated-list'>
      <div className={`overlay ${dataChanged ? '' : 'transparent'}`}>
        <Loader />
      </div>
      {children}
    </div>
  );
};
