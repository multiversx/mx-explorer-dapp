import React from 'react';

export const Led = ({ color }: { color: string }) => {
  return <span className={`led ${color}`} />;
};
