import * as React from 'react';

const Led = ({ color }: { color: string }) => {
  return <span className={`led ${color}`} />;
};
export default Led;
