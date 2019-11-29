import '@testing-library/jest-dom/extend-expect';
import { fireEvent, renderWithRouter } from './../../utils/wallet-test-utils';

const fileName = 'e4445b9dad40f1e16e7158bff8f866ffcee82c08dbb761d94b3cf59aeba3478a.json';
const file = new File(
  [
    `{"version":4,"id":"e2ecdc24-6b54-4b61-bac9-afb7998b9ac4","address":"e4445b9dad40f1e16e7158bff8f866ffcee82c08dbb761d94b3cf59aeba3478a","bech32":"erd1u3z9h8ddgrc7zmn3tzll37rxll8wstqgmwmkrk2t8n6e46arg79q5v5wt6","crypto":{"ciphertext":"8c511cddc123c64d1ba65ff9a39a229f2e94cbf54066e494edec227fb8ea247b8a8fabdd816891972787331d963561d1e28f6af2eaef50c187834b56eb3fe149","cipherparams":{"iv":"e23cc9c6906af9862dc4cc3bae73e1e4"},"cipher":"aes-128-ctr","kdf":"scrypt","kdfparams":{"dklen":32,"salt":"8203c987b689e44cc5251d27fcb31adb6edcc3f4874299a86cc585aba64d4e27","n":4096,"r":8,"p":1},"mac":"0560aeec8ae8b476a651e72c2f223ded4fb0623175ff0bbbbee946347db1689f","machash":"sha3256"}}`,
  ],
  fileName,
  {
    type: 'text/plain',
  }
);

const login = () => {
  const {
    getByLabelText,
    findByTestId,
    getByTestId,
    getByText,
    container,
    wait,
  } = renderWithRouter({
    route: '/local/login',
  });

  const inputEl = getByLabelText('Private Key');

  Object.defineProperty(inputEl, 'files', {
    value: [file],
  });

  fireEvent.change(inputEl);

  const passwordInput = getByTestId('accessPass');
  fireEvent.change(passwordInput, '123456789');

  const button = getByText('Unlock Wallet');
  fireEvent.click(button);

  return { getByLabelText, findByTestId, getByText, container, wait };
};

test('Balance updates only on new server response', async () => {
  const { getByText, wait } = login();
  await wait(() => {
    const address = getByText('ADDRESS');
    expect(address.innerHTML).toBe(`ASD`);
  });
});
