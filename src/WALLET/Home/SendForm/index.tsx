import React, { useMemo } from 'react';
import { useGlobalState } from './../../../context';
import { Loader } from './../../../sharedComponents';
import { useWalletState } from './../../context';
import SendForm, { SendFormikType } from './SendForm';
import SuccessTransaction from './SuccessTransaction';

const SendFormik = ({ populateDetails }: SendFormikType) => {
  const {
    activeTestnet: {
      economics,
      denomination,
      data,
      nodeUrl,
      decimals,
      gasLimitEditable,
      gasLimit: testnetGasLimit,
      gasPrice: testnetGasPrice,
    },
    timeout,
  } = useGlobalState();
  const { balance, privateKey, nonce, publicKey, lastTxHash } = useWalletState();

  const props = {
    testnetGasLimit,
    denomination,
    balance,
    economics,
    testnetGasPrice,
    publicKey,
    privateKey,
    nodeUrl,
    nonce,
    timeout,
    decimals,
    data,
    populateDetails,
    gasLimitEditable,
  };

  const SendComponent = () => {
    return balance === '...' ? (
      <Loader />
    ) : (
      <div className="card">
        <div className="card-body">
          {lastTxHash === '' ? (
            <div id="sendTransaction" className="h-100">
              <h4 className="card-title">Send Transaction</h4>
              <SendForm {...props} />
            </div>
          ) : (
            <SuccessTransaction />
          )}
        </div>
      </div>
    );
  };

  return useMemo(SendComponent, [privateKey, nonce, publicKey, lastTxHash]);
};

export default SendFormik;
