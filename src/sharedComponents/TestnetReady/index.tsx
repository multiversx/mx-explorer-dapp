import React from 'react';
import { useLocation } from 'react-router-dom';
import { useGlobalState } from '../../context';

const TestnetReady: React.FC = ({ children }) => {
  const globalState = useGlobalState();

  const { pathname } = useLocation();

  let locationArray = pathname.substr(1).split('/');
  const testnetId = locationArray[0];
  const allTestnetIds = globalState.config.testnets.map(testnet => testnet.id);

  let testnetReady = true;

  if (allTestnetIds.includes(testnetId) && globalState.activeTestnetId !== testnetId) {
    testnetReady = false;
  }

  return testnetReady ? <>{children}</> : null;
};

export default TestnetReady;
