import React from 'react';
import { useLocation } from 'react-router-dom';
import { useGlobalState, useGlobalDispatch } from '../../context';

export default function TestnetRouter() {
  const globalState = useGlobalState();
  const dispatch = useGlobalDispatch();
  const { pathname } = useLocation();

  let locationArray = pathname.substr(1).split('/');

  const testnetId = locationArray[0];

  React.useEffect(() => {
    const allTestnetIds = globalState.config.testnets.map(testnet => testnet.id);

    if (allTestnetIds.includes(testnetId) && globalState.activeTestnetId !== testnetId) {
      // if route contains a testnet at the beginning replace the testnet
      dispatch({ type: 'changeTestnet', testnetId });
    } else if (
      (allTestnetIds.includes(testnetId) && globalState.defaultTestnet.id === testnetId) ||
      (testnetId === '' && globalState.activeTestnetId !== '')
    ) {
      // if selected testnet is the same as the default, reset the default
      dispatch({ type: 'changeTestnet', testnetId: '' });
    }
  }, [testnetId, dispatch, globalState]);

  return <></>;
}
