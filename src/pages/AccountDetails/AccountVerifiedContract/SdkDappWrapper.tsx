import { ReactNode, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { initApp, InitAppType } from 'lib';
import { activeNetworkSelector } from 'redux/selectors';

import { useGetEnvironment } from './hooks';

export const SdkDappWrapper = ({ children }: { children: ReactNode }) => {
  const environment = useGetEnvironment();
  const { apiAddress } = useSelector(activeNetworkSelector);
  const walletConnectV2ProjectId = import.meta.env.VITE_APP_WALLETCONNECT_ID;

  const [state, setState] = useState<{
    content: ReactNode | null;
  }>({
    content: null
  });

  const isMountingRef = useRef(false);

  const initializeApp = async () => {
    if (isMountingRef.current || !environment) {
      return;
    }

    isMountingRef.current = true;

    const config: InitAppType = {
      storage: { getStorageCallback: () => sessionStorage },
      dAppConfig: {
        nativeAuth: true,
        environment,
        network: {
          name: 'sdk-sc-explorer',
          skipFetchFromServer: true,
          apiAddress
        },
        providers: {
          walletConnect: {
            walletConnectV2ProjectId
          }
        }
      }
    };

    await initApp(config);

    setState({
      content: children
    });

    isMountingRef.current = false;
  };

  useEffect(() => {
    initializeApp();
  }, []);

  return <>{state.content}</>;
};
