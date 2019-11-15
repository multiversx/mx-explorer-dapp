import React from 'react';
import { Redirect } from 'react-router-dom';
import { useWalletState } from './../context';

const WalletHome = () => {
  const { userId } = useWalletState();
  if (userId === '') return <Redirect to="/login" />;
  return <h1>Wallet home</h1>;
};

export default WalletHome;
