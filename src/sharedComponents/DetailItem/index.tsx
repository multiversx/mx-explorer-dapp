import * as React from 'react';

const DetailItem = ({
  children,
  title,
  className = '',
}: {
  children: React.ReactNode;
  title: string;
  className?: string;
}) => (
  <div className={`row py-3 border-bottom detail-item ${className}`}>
    <div className="col-lg-2 text-secondary text-lg-right">{title}</div>
    <div className="col">{children}</div>
  </div>
);

export default DetailItem;
