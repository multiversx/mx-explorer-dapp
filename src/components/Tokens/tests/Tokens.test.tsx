import { fireEvent, wait, beforeAll } from 'utils/test-utils';

describe('Tokens Page', () => {
  test('Tokens page is displaying', async () => {
    const render = beforeAll({
      route: '/tokens',
    });

    expect(document.title).toEqual('Tokens • Elrond Explorer');

    await wait(async () => {
      expect(render.queryByTestId('title')!.innerHTML).toBe('Tokens');
      const table = await render.findByTestId('tokensTable');
      expect(table.childElementCount).toBe(1);
    });
  });

  test('Tokens page loading state', async () => {
    const render = beforeAll({
      route: '/tokens',
    });

    const loader = await render.findByTestId('loader');
    expect(loader.innerHTML).toBeDefined();
  });

  test('Tokens page failed state', async () => {
    const render = beforeAll({
      route: '/tokens',
      networkRequests: {
        tokens: () => Promise.resolve(new Error('error')),
      },
    });

    const failedState = await render.findByTestId('errorScreen');
    expect(failedState.innerHTML).toBeDefined();
  });
});

describe('Tokens Page Links', () => {
  test('Tokens page link', async () => {
    const render = beforeAll({
      route: '/tokens',
    });

    const link = await render.findByTestId('tokenLink0');
    expect(link.textContent).toBe('test');

    fireEvent.click(link);
    await wait(async () => {
      expect(document.title).toEqual('Token Details • Elrond Explorer');
    });
  });
});
