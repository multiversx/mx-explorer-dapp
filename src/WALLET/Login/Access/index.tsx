import React, { useMemo } from 'react';
import { withRouter } from 'react-router-dom';
import { useWalletState } from './../../context';
import { useGlobalState } from './../../../context';
import AccessFormik from './AccessForm';

const AccessWallet = withRouter(props => {
  const { activeTestnetId } = useGlobalState();
  const { loggedIn } = useWalletState();

  const AccessPage = ({ activeTestnetId }: { activeTestnetId: string }) => (
    <div className="card">
      <div className="card-body">
        <h4 className="card-title">Access My Wallet</h4>
        <p className="lead">Check balance, view public address or send ERD tokens.</p>
        <AccessFormik
          loggedIn={loggedIn}
          history={props.history}
          activeTestnetId={activeTestnetId}
        />
      </div>
    </div>
  );

  return useMemo(() => <AccessPage activeTestnetId={activeTestnetId} />, [activeTestnetId]);
});

export default AccessWallet;
