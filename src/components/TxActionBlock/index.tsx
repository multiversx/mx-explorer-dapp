import * as React from 'react';
import TxActionCollection from './TxActionCollection';
import TxActionNft from './TxActionNft';
import TxActionToken from './TxActionToken';

export default class TxActionBlock extends React.Component<{
  children: React.ReactNode;
}> {
  static Collection = TxActionCollection;
  static Nft = TxActionNft;
  static Token = TxActionToken;

  render() {
    return null;
  }
}
