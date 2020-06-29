import React from 'react';
import { useLocation } from 'react-router-dom';
import { useGlobalDispatch, useGlobalState } from 'context';

export default function TestnetRouter() {
  const globalState = useGlobalState();
  const dispatch = useGlobalDispatch();
  const { pathname } = useLocation();

  const locationArray = pathname.substr(1).split('/');

  const testnetId = locationArray[0];

  const allTestnetIds = globalState.config.testnets.map((testnet) => testnet.id);

  function changeTestnet() {
    const {
      activeTestnetId,
      defaultTestnet: { id: defaultTestnetId },
    } = globalState;

    if (allTestnetIds.includes(testnetId) && activeTestnetId !== testnetId) {
      // if route contains a testnet at the beginning replace the testnet
      dispatch({ type: 'changeTestnet', testnetId });
    } else if (
      (allTestnetIds.includes(testnetId) && defaultTestnetId === testnetId) ||
      (testnetId === '' && activeTestnetId !== '')
    ) {
      // if selected testnet is the same as the default, reset the default
      dispatch({ type: 'changeTestnet', testnetId: '' });
    }
  }

  React.useEffect(changeTestnet, [testnetId]);

  return <></>;
}
