import * as React from 'react';
import { useGlobalState } from '../../context';
import Validators from './ValidatorsPage';

const ValidatorsPage = () => {
  const {
    activeTestnet: { nodeUrl },
    timeout,
  } = useGlobalState();

  return <Validators timeout={timeout} nodeUrl={nodeUrl} />;
};

export default ValidatorsPage;
