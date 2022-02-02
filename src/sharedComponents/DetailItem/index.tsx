import * as React from 'react';

const DetailItem = ({
  children,
  title,
  className = '',
  colWidth = '2',
}: {
  children: React.ReactNode;
  title: string | React.ReactNode;
  className?: string;
  colWidth?: string;
}) => (
  <div className={`row py-3 border-bottom detail-item ${className}`}>
    <div className={`col-lg-${colWidth} text-secondary text-lg-right pl-lg-spacer`}>{title}</div>
    <div className={`col-lg-${12 - Number(colWidth)} pr-lg-spacer`}>{children}</div>
  </div>
);

export default DetailItem;
