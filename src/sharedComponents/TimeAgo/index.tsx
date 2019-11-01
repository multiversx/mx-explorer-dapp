import React from 'react';
import timeAgo from './timeAgo';

const TimeAgo = ({ value }: { value: number }) => {
  return <>{timeAgo(value * 1000)}</>;
};

export default TimeAgo;
