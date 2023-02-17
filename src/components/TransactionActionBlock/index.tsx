import React from 'react';

import { TransactionActionCollection } from './TransactionActionCollection';
import { TransactionActionNft } from './TransactionActionNft';
import { TransactionActionToken } from './TransactionActionToken';

export default class TransactionActionBlock extends React.Component<{
  children: React.ReactNode;
}> {
  static Collection = TransactionActionCollection;
  static Nft = TransactionActionNft;
  static Token = TransactionActionToken;

  render() {
    return null;
  }
}
