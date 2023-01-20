import React from 'react';
import { Dot } from 'recharts';

const CustomDot = (props: any) => {
  const { payload } = props;

  if (payload?.isBinnedData) {
    return <></>;
  }

  return <Dot {...props} />;
};

export default CustomDot;
