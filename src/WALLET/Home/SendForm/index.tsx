import React, { useMemo } from 'react';
import { useGlobalState } from './../../../context';
import { Loader } from './../../../sharedComponents';
import { useWalletDispatch, useWalletState } from './../../context';
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
  const { balance, privateKey, nonce, publicKey, lastTxHash, serverBalance } = useWalletState();
  const dispatch = useWalletDispatch();

  const props = {
    testnetGasLimit,
    denomination,
    balance,
    serverBalance,
    dispatch,
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
      <div className="card" style={{ height: 'auto' }}>
        {lastTxHash === '' ? (
          <div className="card-body" style={{ height: '422px' }}>
            <div id="sendTransaction" className="h-100">
              <h4 className="card-title" data-testid="sendFormTitle">
                Send Transaction
              </h4>
              <SendForm {...props} />
            </div>
          </div>
        ) : (
          <div className="card-body" style={{ height: '422px' }}>
            <SuccessTransaction />
          </div>
        )}
      </div>
    );
  };

  return useMemo(SendComponent, [privateKey, nonce, publicKey, lastTxHash, balance]);
};

export default SendFormik;
