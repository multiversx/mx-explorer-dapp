import React from 'react';

export interface DetailItemType {
  children?: React.ReactNode;
  title?: string | React.ReactNode;
  className?: string;
  colWidth?: string;
  noBorder?: boolean;
  verticalCenter?: boolean;
}

export const DetailItem = ({
  children,
  title,
  className = '',
  colWidth = '2',
  noBorder = false,
  verticalCenter = false
}: DetailItemType) => {
  if (!title && !children) {
    return null;
  }

  return (
    <div
      className={`row detail-item ${className} ${
        noBorder ? 'pt-3 pb-1' : 'border-bottom py-3'
      }`}
    >
      <div
        className={`col-lg-${colWidth} ${
          verticalCenter
            ? 'd-flex align-items-center justify-content-lg-end'
            : ''
        } text-lg-end  text-neutral-400`}
      >
        {title}
      </div>
      {children && (
        <div className={`col-lg-${12 - Number(colWidth)} pe-lg-spacer`}>
          {children}
        </div>
      )}
    </div>
  );
};
