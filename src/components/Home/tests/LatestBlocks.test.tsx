import axios from 'axios';
import {
  fireEvent,
  renderWithRouter,
  wait,
  meta,
  config as optionalConfig,
  waitForElement,
} from 'utils/test-utils';

import {
  heartbeatstatus,
  validators,
  transactions,
  transactionsSearch,
  blocks,
  statistics,
} from 'utils/rawData';

export const beforeAll = (blocksError = false, transactionsError = false) => {
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
      case url.endsWith('/validators'):
        return Promise.resolve({ data: validators });
      case url.includes('/blocks'):
        if (blocksError) {
          return Promise.resolve(new Error('blocks error'));
        }
        return Promise.resolve({ data: blocks });
      case url.endsWith('/transactions'):
        if (transactionsError) {
          return Promise.resolve(new Error('transactions error'));
        }
        return Promise.resolve({ data: transactionsSearch });
      case url.includes('/transactions'):
        if (transactionsError) {
          return Promise.resolve(new Error('transactions error'));
        }
        return Promise.resolve({ data: transactions });
      // --- page load ---
    }
  });

  return renderWithRouter({
    route: '/',
    optionalConfig,
  });
};

describe('Latest Blocks', () => {
  test('Latest Blocks component is displaying', async () => {
    const render = beforeAll();
    await wait(async () => {
      expect(render.queryByTestId('blocksList')!.childElementCount).toBe(25);
    });
  });

  test('Latest Blocks component loading state', async () => {
    const render = beforeAll();
    // correct way to get rid of not wrapped in act
    // https://stackoverflow.com/a/60164821/4264699
    const blocksLoader = await waitForElement(() => render.queryByTestId('blocksLoader'));
    expect(blocksLoader).toBeDefined();
  });

  test('Latest Blocks component failing state', async () => {
    const render = beforeAll(true);

    await wait(async () => {
      expect(render.queryByText('Unable to load blocks')).toBeDefined();
    });
  });
});

describe('Latest Blocks Links', () => {
  test('View All Blocks', async () => {
    const render = beforeAll();

    const allBlocksLink = await render.findByText('View All Blocks');
    expect(allBlocksLink).toBeInTheDocument();

    fireEvent.click(allBlocksLink);
    await wait(async () => {
      expect(document.title).toEqual('Blocks • Elrond Explorer');
    });
  });
  test('Block Link', async () => {
    const render = beforeAll();

    const blockLink = await render.findByTestId('blockLink0');
    expect(blockLink).toBeInTheDocument();

    expect(blockLink.innerHTML).toBe(blocks[0].nonce.toString());
    fireEvent.click(blockLink);
    await wait(async () => {
      expect(document.title).toEqual('Block Details • Elrond Explorer');
    });
  });
  test('Block Hash Link', async () => {
    const render = beforeAll();

    const blockHashLink = await render.findByTestId('blockHashLink0');
    expect(blockHashLink).toBeInTheDocument();

    expect(blockHashLink.innerHTML).toBe('7d6df53015...fcf9990698');
    fireEvent.click(blockHashLink);
    await wait(async () => {
      expect(document.title).toEqual('Block Details • Elrond Explorer');
    });
  });
});
