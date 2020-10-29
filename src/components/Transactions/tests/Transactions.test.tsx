import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import {
  renderWithRouter,
  wait,
  meta,
  config as optionalConfig,
  waitForElement,
  fireEvent,
  act,
} from 'utils/test-utils';
import {
  heartbeatstatus,
  validators,
  transactions,
  transactionsSearch,
  statistics,
} from 'utils/rawData';

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
      case url.includes('/transactions-alt/count'):
        return Promise.resolve({ data: 14253408 });
      case url.endsWith('/transactions'):
        if (transactionsError) {
          return Promise.resolve(new Error('transaction error'));
        }
        return Promise.resolve({ data: transactionsSearch });
      case url.includes('/transactions'):
        if (transactionsError) {
          return Promise.resolve(new Error('transaction error'));
        }
        return Promise.resolve({ data: transactions });
    }
  });

  return renderWithRouter({
    route,
    optionalConfig,
  });
};

describe('Transactions Page', () => {
  test('Transactions page is displaying', async () => {
    const render = beforeAll('/transactions');
    const title = await waitForElement(() => render.queryByTestId('title')!.innerHTML);
    expect(title).toBe('Transactions');
  });

  test('Transactions data is displayed correctly', async () => {
    const render = beforeAll('/transactions');
    const pageInterval = await waitForElement(() => render.queryByTestId('pageInterval'));
    expect(pageInterval!.innerHTML).toBe('1-50');

    const table = render.queryByTestId('transactionsTable');
    const numberOfRows = table!.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    expect(numberOfRows).toHaveLength(50);
  });

  test('Transactions pager working', async () => {
    const render = beforeAll('/transactions?page=1');

    const pageInterval = await waitForElement(() => render.queryByTestId('pageInterval'));
    expect(pageInterval!.innerHTML).toBe('1-50');
  });
});

describe('Transactions Page Links', () => {
  test('Transaction link', async () => {
    const render = beforeAll('/transactions');

    const links = await render.findAllByTestId('transactionLink');
    expect(links[0].textContent).toBe(
      '72d26fd09ed2d2bb649a401428eca1a0a7b5a11242daf5500990305f600a9a91'
    );

    fireEvent.click(links[0]);
    await act(async () => {
      await wait(async () => {
        expect(document.title).toEqual('Transaction Details • Elrond Explorer');
      });
    });
  });
  test('Shard from link', async () => {
    const render = beforeAll('/transactions');

    const links = await render.findAllByTestId('shardFromLink');
    expect(links[0].textContent).toBe('Shard 1');

    fireEvent.click(links[0]);
    await wait(async () => {
      expect(document.title).toEqual('Shard Details • Elrond Explorer');
    });
  });
  test('Shard to link', async () => {
    const render = beforeAll('/transactions');

    const links = await render.findAllByTestId('shardToLink');
    expect(links[0].textContent).toBe('Shard 0');

    fireEvent.click(links[0]);
    await wait(async () => {
      expect(document.title).toEqual('Shard Details • Elrond Explorer');
    });
  });
  test('Receiver link', async () => {
    const render = beforeAll('/transactions');

    const links = await render.findAllByTestId('receiverLink');
    expect(links[0].textContent).toBe(
      'erd1hqplnafrhnd4zv846wumat2462jy9jkmwxtp3nwmw8ye9eclr6fq40f044'
    );

    fireEvent.click(links[0]);
    await wait(async () => {
      expect(document.title).toEqual('Address Details • Elrond Explorer');
    });
  });
});
