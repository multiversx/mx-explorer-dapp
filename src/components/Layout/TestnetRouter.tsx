import React from 'react';
import { useLocation } from 'react-router-dom';
import { useGlobalDispatch, useGlobalState } from 'context';
import { defaultTestnet } from 'context/config';
import buildConfig from 'context/getAsyncConfig';

export default function TestnetRouter() {
  const {
    config,
    activeTestnetId,
    defaultTestnet: { id: defaultTestnetId },
  } = useGlobalState();
  const dispatch = useGlobalDispatch();
  const { pathname } = useLocation();

  const locationArray = pathname.substr(1).split('/');

  const testnetId = locationArray[0];

  const allTestnetIds = config.testnets.map((testnet) => testnet.id);

  function changeTestnet() {
    const testnet =
      config.testnets.find((t) => {
        if (testnetId) {
          return t.id === testnetId;
        } else return t.default;
      }) || defaultTestnet;

    if (allTestnetIds.includes(testnetId) && activeTestnetId !== testnetId) {
      // if route contains a testnet at the beginning replace the testnet
      dispatch({ type: 'setBrandData', brandData: [] });
      if (testnet.fetchedFromNetworkConfig === undefined) {
        buildConfig(testnetId, config).then((config) => {
          dispatch({ type: 'updateTestnets', config });
          dispatch({ type: 'changeTestnet', testnetId });
        });
      } else {
        dispatch({ type: 'changeTestnet', testnetId });
      }

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
