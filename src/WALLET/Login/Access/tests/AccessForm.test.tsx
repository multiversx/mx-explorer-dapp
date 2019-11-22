import '@testing-library/jest-dom/extend-expect';
import { renderWithRouter } from '../../../utils/wallet-test-utils';

test('Wallet Login page is displaying', () => {
  const { getByTestId } = renderWithRouter({
    route: '/',
  });

  //   const input = getByTestId('walletFileInput');

  //   expect(a).toBe('Create New Wallet');
});
