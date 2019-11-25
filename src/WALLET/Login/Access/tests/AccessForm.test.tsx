import '@testing-library/jest-dom/extend-expect';
import { render, wait } from '@testing-library/react';
import axios from 'axios';
import { Formik } from 'formik';
import React from 'react';
import { fireEvent, renderWithRouter } from '../../../utils/wallet-test-utils';

const fileName = '39e82d234b7c73c34f76091818f2c9f68d93914d12f3e0c507c59a9d3e38ad29.json';
const file = new File(
  [
    `{"version":4,"id":"0dc4c817-0cdd-40dc-9855-a14005472512","address":"39e82d234b7c73c34f76091818f2c9f68d93914d12f3e0c507c59a9d3e38ad29","bech32":"erd1885z6g6t03euxnmkpyvp3ukf76xe8y2dzte7p3g8ckdf603c455snnrxx7","crypto":{"ciphertext":"604cf96da9abb4e2eab2bc1ff662e900aaac8e226163494c8b1f9a4716d3327e4e34b59a010e40e72d28ccf39174bf9e4ac28461da0335f53f1802dc380d5044","cipherparams":{"iv":"a922182b1feacf8feb2bc798e2fb4205"},"cipher":"aes-128-ctr","kdf":"scrypt","kdfparams":{"dklen":32,"salt":"600ff7099a43ed0eff5b11d631107187d911cfa97870130124d1ec80df2e435b","n":4096,"r":8,"p":1},"mac":"071360c5656d5128d456b57932761a62501c5c5797abd51d04938205101801b3","machash":"sha3256"}}`,
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
    route: '/',
  });

  const inputEl = getByLabelText('Private Key');

  Object.defineProperty(inputEl, 'files', {
    value: [file],
  });

  fireEvent.change(inputEl);

  const passwordInput = getByTestId('accessPass');
  fireEvent.change(passwordInput, '123456789');

  return { getByLabelText, findByTestId, getByText, container, wait };
};

test('Wallet upload component working', async () => {
  const { findByTestId } = login();
  const uploadLabel = await findByTestId('walletFileLabel');
  expect(uploadLabel.innerHTML).toEqual(fileName);
});

test('Accessing homepage working', async () => {
  const { findByTestId, container, wait } = login();
  const mockGet = jest.spyOn(axios, 'get');
  mockGet.mockReturnValue(
    Promise.resolve({
      data: {
        account: {
          address: '39e82d234b7c73c34f76091818f2c9f68d93914d12f3e0c507c59a9d3e38ad29',
          nonce: 39,
          balance: '9999570270',
          code: '',
          codeHash: null,
          rootHash: null,
        },
      },
    })
  );

  // const {
  //   getByLabelText,
  //   findByTestId,
  //   getByTestId,
  //   getByText,
  //   container,
  //   wait,
  // } = renderWithRouter({
  //   route: '/',
  // });

  // expect(mockGet).toHaveBeenLastCalledWith('https://elastic-aws.elrond.com/tps/_doc/meta', {
  //   timeout: 3000,
  // });

  const accessWalletBtn = await findByTestId('accessWalletBtn');
  // const accessWalletBtn = getByText('accessWalletBtn');
  fireEvent.click(accessWalletBtn);
  await wait(async () => {
    const sendFormTitle = await findByTestId('sendFormTitle');
    expect(sendFormTitle.innerHTML).toEqual('asd');
  });
  // setTimeout(async () => {

  // });
  // const sendFormTitle = await findByTestId('sendFormTitle');
  // expect(sendFormTitle.innerHTML).toEqual('asd');
  // await wait(async () => {

  // });

  // await wait(() => expect(document.title).toEqual('foo'));
});

it('should not error if called without preventDefault property', async () => {
  const onSubmit = jest.fn();
  const FormNoPreventDefault = (
    <Formik initialValues={{ name: 'jared' }} onSubmit={onSubmit}>
      {({ handleSubmit }) => (
        <button
          data-testid="submit-button"
          onClick={() => handleSubmit({} as any /* undefined event */)}
        />
      )}
    </Formik>
  );
  const { getByTestId } = render(FormNoPreventDefault);

  // expect(() => {
  //   fireEvent.click(getByTestId('submit-button'));
  // }).not.toThrow();

  fireEvent.click(getByTestId('submit-button'));
  await wait(() => expect(onSubmit).toBeCalled());
});
