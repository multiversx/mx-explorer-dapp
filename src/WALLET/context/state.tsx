export interface StateType {
  privateKey: string;
  publicKey: string;
  loggedIn: boolean;
  balance: string;
  nonce: string;
}

const initialState: StateType = {
  privateKey: '',
  publicKey: '',
  loggedIn: false,
  balance: '...',
  nonce: '',
};

export default initialState;
