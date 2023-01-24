import * as React from 'react';

export const DetailItem = ({
  children,
  title,
  className = '',
  colWidth = '2',
  noBorder = false,
  verticalCenter = false
}: {
  children: React.ReactNode;
  title: string | React.ReactNode;
  className?: string;
  colWidth?: string;
  noBorder?: boolean;
  verticalCenter?: boolean;
}) => (
  <div
    className={`row detail-item ${className} ${
      noBorder ? 'pt-3 pb-1' : 'border-bottom py-3'
    }`}
  >
    <div
      className={`col-lg-${colWidth} ${
        verticalCenter ? 'd-flex align-items-center justify-content-lg-end' : ''
      } text-lg-end  text-neutral-400`}
    >
      {title}
    </div>
    <div className={`col-lg-${12 - Number(colWidth)} pe-lg-spacer`}>
      {children}
    </div>
  </div>
);
