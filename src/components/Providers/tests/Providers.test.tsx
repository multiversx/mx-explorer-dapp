import { fireEvent, wait, beforeAll } from 'utils/test-utils';

describe('Providers Page', () => {
  test('Providers page is displaying', async () => {
    const render = beforeAll({
      route: '/providers',
    });

    await wait(async () => {
      expect(document.title).toEqual('Providers • Elrond Explorer');
      const table = await render.findByTestId('providersTable');
      expect(table.childElementCount).toBe(8);
    });
  });

  test('Providers page loading state', async () => {
    const render = beforeAll({
      route: '/providers',
    });

    const loader = await render.findByTestId('loader');
    expect(loader.innerHTML).toBeDefined();
  });

  test('Providers page failed state', async () => {
    const render = beforeAll({
      route: '/providers',
      networkRequests: {
        providers: () => Promise.resolve(new Error('error')),
      },
    });

    const failedState = await render.findByTestId('errorScreenProviders');
    expect(failedState.innerHTML).toBeDefined();
  });
});

describe('Providers Page Links', () => {
  test('Provider page link', async () => {
    const render = beforeAll({
      route: '/providers',
    });

    const link = await render.findByTestId('providerLink0');
    expect(link.textContent).toContain('MetaStake');

    fireEvent.click(link);
    await wait(async () => {
      expect(document.title).toEqual('Provider Details • Elrond Explorer');
    });
  });
});
