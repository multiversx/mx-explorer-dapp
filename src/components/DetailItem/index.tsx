import * as React from 'react';

export const DetailItem = ({
  children,
  title,
  className = '',
  colWidth = '2',
  noBorder = false
}: {
  children: React.ReactNode;
  title: string | React.ReactNode;
  className?: string;
  colWidth?: string;
  noBorder?: boolean;
}) => (
  <div
    className={`row detail-item ${className} ${
      noBorder ? 'pt-3 pb-1' : 'border-bottom py-3'
    }`}
  >
    <div
      className={`col-lg-${colWidth} d-flex align-items-center text-lg-end justify-content-lg-end text-neutral-400`}
    >
      {title}
    </div>
    <div className={`col-lg-${12 - Number(colWidth)} pe-lg-spacer`}>
      {children}
    </div>
  </div>
);
