import { fireEvent, wait, beforeAll } from 'utils/test-utils';

describe('Blocks Page', () => {
  test('Blocks page is displaying', async () => {
    const render = beforeAll({
      route: '/blocks',
    });

    expect(document.title).toEqual('Blocks • Elrond Explorer');

    await wait(async () => {
      expect(render.queryByTestId('title')!.innerHTML).toBe('Blocks');
      const table = await render.findByTestId('blocksTable');
      expect(table.childElementCount).toBe(25);
    });
  });

  test('Blocks page loading state', async () => {
    const render = beforeAll({
      route: '/blocks',
    });

    const loader = await render.findByTestId('loader');
    expect(loader.innerHTML).toBeDefined();
  });

  test('Blocks page failed state', async () => {
    const render = beforeAll({
      route: '/blocks',
      networkRequests: {
        blocks: () => Promise.resolve(new Error('error')),
      },
    });

    const failedState = await render.findByTestId('errorScreen');
    expect(failedState.innerHTML).toBeDefined();
  });
});

describe('Blocks Page Links', () => {
  test('Block page link', async () => {
    const render = beforeAll({
      route: '/blocks',
    });

    const link = await render.findByTestId('blockLink0');
    expect(link.innerHTML).toBe('82768');

    fireEvent.click(link);
    await wait(async () => {
      expect(document.title).toEqual('Block Details • Elrond Explorer');
    });
  });

  test('Block shard link', async () => {
    const render = beforeAll({
      route: '/blocks',
    });

    const link = await render.findByTestId('blockShardLink0');
    expect(link.textContent).toBe('Shard 0');

    fireEvent.click(link);
    await wait(async () => {
      expect(document.title).toEqual('Shard Details • Elrond Explorer');
    });
  });

  test('Block Hash link', async () => {
    const render = beforeAll({
      route: '/blocks',
    });

    const link = await render.findByTestId('blockHashLink0');
    expect(link.textContent).toBe('7d6df53015...fcf9990698');

    fireEvent.click(link);
    await wait(async () => {
      expect(document.title).toEqual('Block Details • Elrond Explorer');
    });
  });
});
