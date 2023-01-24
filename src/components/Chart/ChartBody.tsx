import * as React from 'react';

export const ChartBody = ({ children }: { children: React.ReactNode }) => (
  <div className='card-body chart-body d-flex flex-column justify-content-between h-100'>
    {children}
  </div>
);
