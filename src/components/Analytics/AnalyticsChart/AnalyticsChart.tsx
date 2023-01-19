import React from 'react';
import { ChartListType } from '../Analytics';

export const AnalyticsChart = ({ id, path }: ChartListType) => {
  return <section id={id} className="accounts card"></section>;
};
