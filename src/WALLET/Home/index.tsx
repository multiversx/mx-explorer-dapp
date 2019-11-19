import React, { useMemo } from 'react';
import { withRouter } from 'react-router-dom';
import { useWalletState } from './../context';
import { useGlobalState } from './../../context';

import Home from './Home';

const WalletIndex = withRouter(props => {
  const { activeTestnetId } = useGlobalState();
  const { loggedIn } = useWalletState();

  if (!loggedIn) {
    activeTestnetId
      ? props.history.push(`/${activeTestnetId}/login`)
      : props.history.push(`/login`);
  }

  return useMemo(() => <Home />, []);
});

export default WalletIndex;
