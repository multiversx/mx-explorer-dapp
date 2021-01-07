import React from 'react';
import timeAgo from './timeAgo';

const TimeAgo = ({ value, short = false }: { value: number; short?: boolean }) => {
  const ms = value * 1000;
  let result = timeAgo(ms);

  if (short) {
    const parts = result.split(' ');
    if (parts.length > 1) {
      result = `${parts[0]} ${parts[1]}`;
    }
  }

  return <>{result}</>;
};

export default TimeAgo;
