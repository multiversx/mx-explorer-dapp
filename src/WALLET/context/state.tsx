export interface StateType {
  privateKey: string;
  publicKey: string;
  loggedIn: boolean;
}

const initialState: StateType = {
  privateKey: '',
  publicKey: '',
  loggedIn: false,
};

export default initialState;
