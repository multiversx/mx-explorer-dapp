import React, { useMemo } from 'react';
import { withRouter } from 'react-router-dom';
import { useGlobalState } from './../../context';
import { useWalletState } from './../context';
import Home from './Home';

const WalletIndex = withRouter(props => {
  const {
    activeTestnetId,
    timeout,
    activeTestnet: { nodeUrl },
  } = useGlobalState();
  const { loggedIn, publicKey } = useWalletState();

  if (!loggedIn) {
    activeTestnetId
      ? props.history.push(`/${activeTestnetId}/login`)
      : props.history.push(`/login`);
  }

  const homeProps = { publicKey, nodeUrl, timeout };

  return useMemo(() => <Home {...homeProps} />, []);
});

export default WalletIndex;
