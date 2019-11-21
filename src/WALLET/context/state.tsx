export interface StateType {
  privateKey: string;
  publicKey: string;
  loggedIn: boolean;
  balance: string;
  lastTxHash: string;
  nonce: number;
}

const initialState: StateType = {
  privateKey: '',
  publicKey: '',
  lastTxHash: '',
  loggedIn: false,
  balance: '...',
  nonce: 0,
};

export default initialState;
