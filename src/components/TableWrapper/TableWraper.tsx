import React from 'react';

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
      <div className={`overlay ${dataChanged ? '' : 'transparent'}`}></div>
      {children}
    </div>
  );
};
