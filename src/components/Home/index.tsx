import * as React from 'react';
import Highlights from './../../sharedComponents/Highlights';

import { useGlobalState } from '../../context';

const TransactionDetails: React.FC = () => {
  const {
    activeTestnet: { name },
  } = useGlobalState();

  return (
    <>
      <Highlights />
      <h1>Home: {name}</h1>
    </>
  );
};

export default TransactionDetails;
