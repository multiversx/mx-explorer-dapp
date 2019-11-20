export interface StateType {
  privateKey: string;
  publicKey: string;
  loggedIn: boolean;
  balance: string;
  nonce: number;
}

const initialState: StateType = {
  privateKey: '',
  publicKey: '',
  loggedIn: false,
  balance: '...',
  nonce: -1,
};

export default initialState;
