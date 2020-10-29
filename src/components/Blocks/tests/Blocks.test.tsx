import axios from 'axios';
import {
  fireEvent,
  renderWithRouter,
  wait,
  meta,
  config as optionalConfig,
} from 'utils/test-utils';
import { blocks } from '../../../utils/rawData';
import { heartbeatstatus, validators, statistics } from 'utils/rawData';

export const beforeAll = (blocksError = false) => {
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
      case url.includes('/blokcs/count'):
        return Promise.resolve({ data: 239890 });
      case url.includes('/blocks'):
        if (blocksError) {
          return Promise.resolve(new Error('blocks error'));
        }
        return Promise.resolve({ data: blocks });
      // --- page load ---
    }
  });

  return renderWithRouter({
    route: '/blocks',
    optionalConfig,
  });
};

describe('Blocks', () => {
  test('Blocks page is displaying', async () => {
    const render = beforeAll();

    expect(document.title).toEqual('Blocks • Elrond Explorer');

    await wait(async () => {
      expect(render.queryByTestId('title')!.innerHTML).toBe('Blocks');
      const table = await render.findByTestId('blocksTable');
      expect(table.childElementCount).toBe(25);
    });
  });

  test('Blocks page loading state', async () => {
    const render = beforeAll();

    const loader = await render.findByTestId('loader');
    expect(loader.innerHTML).toBeDefined();
  });

  test('Blocks page failed state', async () => {
    const render = beforeAll(true);

    const failedState = await render.findByTestId('errorScreen');
    expect(failedState.innerHTML).toBeDefined();
  });
});

describe('Blocks Page Links', () => {
  test('Block page link', async () => {
    const render = beforeAll();

    const link = await render.findByTestId('blockLink0');
    expect(link.innerHTML).toBe('82768');

    fireEvent.click(link);
    await wait(async () => {
      expect(document.title).toEqual('Block Details • Elrond Explorer');
    });
  });

  test('Block shard link', async () => {
    const render = beforeAll();

    const link = await render.findByTestId('blockShardLink0');
    expect(link.textContent).toBe('Shard 0');

    fireEvent.click(link);
    await wait(async () => {
      expect(document.title).toEqual('Shard Details • Elrond Explorer');
    });
  });

  test('Block Hash link', async () => {
    const render = beforeAll();

    const link = await render.findByTestId('blockHashLink0');
    expect(link.textContent).toBe('7d6df53015...fcf9990698');

    fireEvent.click(link);
    await wait(async () => {
      expect(document.title).toEqual('Block Details • Elrond Explorer');
    });
  });
});
