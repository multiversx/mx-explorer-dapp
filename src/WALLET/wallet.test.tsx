import '@testing-library/jest-dom/extend-expect';
import { renderWithRouter } from './utils/wallet-test-utils';

test('Wallet lands on login', () => {
  const { getByTestId } = renderWithRouter({
    route: '/',
  });

  const input = getByTestId(`createNewWalletTitle`);
  //   const a = getAllByText((content, element) => content.startsWith('Create'));

  expect(input.innerHTML).toEqual('Create New Wallet');
});
