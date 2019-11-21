import * as React from 'react';
import { useWalletState } from './../../context';
import SendForm from './SendForm';
import SuccessTransaction from './SuccessTransaction';

const SendFormik = () => {
  const { lastTxHash } = useWalletState();

  return (
    <div className="card">
      <div className="card-body">
        {lastTxHash === '' ? (
          <div id="sendTransaction">
            <h4 className="card-title">Send Transaction</h4>
            <SendForm />
          </div>
        ) : (
          <SuccessTransaction />
        )}
      </div>
    </div>
  );
};

export default SendFormik;
