import '@testing-library/jest-dom/extend-expect';
import { fireEvent, renderWithRouter } from '../../../utils/wallet-test-utils';

test('Wallet Pem page is working', () => {
  const { getByLabelText, getByText } = renderWithRouter({
    route: '/unlock-pem',
  });

  const file = new File(
    [
      `-----BEGIN PRIVATE KEY for 959867d01e909fd925bb5c244db660af350b8d0a3b79a03389fbdb65555d65a6-----
YTI3ZWExMzJhN2QxMGRhNTlhY2M5NmQ4ZjQxM2NkYWNlZTc2YWNkZjZiNmEyNTc0
YjhlYmMzOTA2OWRhNjIwZQ==
-----END PRIVATE KEY for 959867d01e909fd925bb5c244db660af350b8d0a3b79a03389fbdb65555d65a6-----`,
    ],
    'example.pem',
    {
      type: 'text/plain',
    }
  );

  const inputEl = getByLabelText('Private Key');

  Object.defineProperty(inputEl, 'files', {
    value: [file],
  });

  fireEvent.change(inputEl);

  expect(getByText('example.pem').innerHTML).toEqual('example.pem');
});
