export interface StateType {
  privateKey: string;
  publicKey: string;
  loggedIn: boolean;
  balance: string;
  serverBalance: string;
  lastTxHash: string;
  nonce: number;
}

const initialState: StateType = {
  privateKey: '',
  publicKey: '',
  lastTxHash: '',
  loggedIn: false,
  balance: '...',
  serverBalance: '...',
  nonce: 0,
};

export default initialState;
