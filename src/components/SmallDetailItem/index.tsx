import React from 'react';

const SmallDetailItem = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string | React.ReactNode;
}) => (
  <div className="row py-3 border-bottom detail-item">
    <div className="col-lg-3 text-secondary pl-lg-spacer pr-lg-0">{title}</div>
    <div className="col-lg-9 pr-lg-spacer pl-lg-0">{children}</div>
  </div>
);

export default SmallDetailItem;
