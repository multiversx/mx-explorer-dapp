import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import { renderWithRouter, wait, meta, config as optionalConfig } from '../../../utils/test-utils';
import { heartbeatstatus, validators, transactionsSearch, statistics } from 'utils/rawData';

const address = {
  account: {
    address: 'erd1s5zs68g3j463rgqjskueh9288qhv3w2l7xac4g78vn9jue88ddds6alj03',
    nonce: 0,
    balance: '74200000000000000000000',
    code: '',
    codeHash: null,
    rootHash: null,
  },
};

export const beforeAll = (route = '', transactionsError = false) => {
  const mockGet = jest.spyOn(axios, 'get');

  mockGet.mockImplementation((url: string): any => {
    switch (true) {
      // --- page load ---
      case url.includes('/tps/meta'):
        return Promise.resolve({ data: meta });
      case url.includes(`/node/heartbeatstatus`):
        return Promise.resolve({ data: { data: heartbeatstatus, code: 'successful' } });
      case url.includes('/validator/statistics'):
        return Promise.resolve({ data: { data: statistics, code: 'successful' } });
      // --- page load ---
      case url.endsWith('/validators'):
        return Promise.resolve({ data: validators });
      case url.includes('/transactions/count'):
        return Promise.resolve({ data: 14253408 });
      case url.includes('/transactions'):
        if (transactionsError) {
          return Promise.resolve(new Error('transaction error'));
        }
        return Promise.resolve({ data: transactionsSearch });
    }
  });

  return renderWithRouter({
    route,
    optionalConfig,
  });
};

describe('Address', () => {
  test('Address page is displaying', async () => {
    const render = beforeAll(`/address/${address.account.address}`);
    expect(document.title).toEqual('Address Details • Elrond Explorer');

    await wait(async () => {
      expect(render.getByText(address.account.address)).toBeInTheDocument();
      const pageInterval = render.getByTestId('pageInterval');
      expect(pageInterval!.innerHTML).toBe('1-50');
    });
  });
  test('Address page loading state', async () => {
    const render = beforeAll(`/address/${address.account.address}`);
    const loader = await render.findByTestId('loader');
    expect(loader).toBeDefined();
  });

  test('Transactions errorScreen showing', async () => {
    const render = beforeAll('/transactions/', true);

    const errorScreen = await render.findByTestId('errorScreen');
    expect(errorScreen).toBeInTheDocument();
  });
});
