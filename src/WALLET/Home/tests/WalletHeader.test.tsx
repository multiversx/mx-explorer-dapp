import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import { fireEvent, renderWithRouter } from './../../utils/wallet-test-utils';

const fileName = '054fefc001aad80a9454c2d9a176ca7c403b087e79e552dccfd2aca27d12d2b5.json';
const irelandFile = new File(
  [
    `{"version":4,"id":"5219a63e-1152-40fe-ad86-9353bc11257e","address":"054fefc001aad80a9454c2d9a176ca7c403b087e79e552dccfd2aca27d12d2b5","bech32":"erd1q487lsqp4tvq49z5ctv6zak203qrkzr708j49hx062k2ylgj626s533j7k","crypto":{"ciphertext":"d26f2de3f8956cec9dc56801da25d49263993bb5f590344f2c0fcdc4e95f0c5f3a06c92a79060ac643cf2081123b7e07462c0539166ac71087151af3c7fe93f2","cipherparams":{"iv":"c453e6e12c42d011a85409fcd249a74f"},"cipher":"aes-128-ctr","kdf":"scrypt","kdfparams":{"dklen":32,"salt":"8cec8c996dbb1021e2411edaa08b77767e4a3f9d103c5621d3db50996d425610","n":4096,"r":8,"p":1},"mac":"7f7038d2e98b6d204191d5b9733f93bb5e82713e73c5b10e89ad515d3289d068","machash":"sha3256"}}`,
  ],
  fileName,
  {
    type: 'text/plain',
  }
);

test('Balance updates only on new server response', async () => {
  const { findByTestId, getByTestId, wait } = renderWithRouter({
    route: '/ireland/login',
  });

  const accessPass: any = getByTestId('accessPass');
  fireEvent.change(accessPass, { target: { value: '123456789' } });
  fireEvent.blur(accessPass);

  const walletFile: any = getByTestId('walletFile');

  fireEvent.change(walletFile, { target: { files: [irelandFile] } });
  fireEvent.blur(walletFile);

  const uploadLabel = await findByTestId('walletFileLabel');
  expect(uploadLabel.innerHTML).toBe(fileName);

  expect(accessPass.value).toBe('123456789');

  const button: any = getByTestId('submitButton');

  const mockGet = jest.spyOn(axios, 'get');
  mockGet.mockReturnValueOnce(
    Promise.resolve({
      data: {
        account: {
          address: '054fefc001aad80a9454c2d9a176ca7c403b087e79e552dccfd2aca27d12d2b5',
          nonce: 0,
          balance: '2000',
          code: '',
          codeHash: null,
          rootHash: null,
        },
      },
    })
  );

  const mockPost = jest.spyOn(axios, 'post');
  mockPost.mockReturnValueOnce(
    Promise.resolve({
      data: {
        took: 0,
        timed_out: false,
        _shards: { total: 1, successful: 1, skipped: 0, failed: 0 },
        hits: { total: { value: 0, relation: 'eq' }, max_score: null, hits: [] },
      },
    })
  );

  await wait(
    async () => {
      fireEvent.click(button);
    },
    { timeout: 50 }
  );

  expect(button.disabled).toBe(false);

  expect(document.title).toEqual('Elrond Wallet');

  const addressLabel: any = await findByTestId(`addressLabel`);
  expect(addressLabel!.innerHTML).toBe(`ADDRESS`);

  const balance: any = await findByTestId(`balance`);
  expect(balance.innerHTML).toBe(`0.2000&nbsp;ERD`);
});
