import React from 'react';
import { useLocation } from 'react-router-dom';
import { useGlobalState } from '../../context';

const TestnetReady: React.FC = ({ children }) => {
  const globalState = useGlobalState();
  const { activeTestnetId } = useGlobalState();
  const { pathname } = useLocation();

  let locationArray = pathname.substr(1).split('/');
  const testnetId = locationArray[0];
  const allTestnetIds = globalState.config.testnets.map(testnet => testnet.id);

  const [testnetReady, setTestnetReady] = React.useState(false);

  React.useEffect(() => {
    if (allTestnetIds.includes(testnetId) && activeTestnetId !== testnetId) {
      setTestnetReady(false);
    } else setTestnetReady(true);
  }, [testnetId, activeTestnetId, allTestnetIds]);

  return testnetReady ? <>{children}</> : null;
};

export default TestnetReady;
