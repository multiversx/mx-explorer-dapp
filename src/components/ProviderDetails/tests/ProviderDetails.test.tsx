import '@testing-library/jest-dom/extend-expect';
import { wait, beforeAll } from 'utils/test-utils';
import { provider } from 'utils/rawData';

describe('Provider Details Page', () => {
  test('Provider Details page is displaying', async () => {
    const render = beforeAll({
      route: `/providers/${provider.contract}`,
    });

    await wait(async () => {
      expect(document.title).toEqual('Provider Details • Elrond Explorer');

      const address = await render.findByTestId('address');
      expect(address.textContent).toBe(provider.contract);
    });
  });
  test('Provider Details page loading state', async () => {
    const render = beforeAll({
      route: `/providers/${provider.contract}`,
    });
    const loader = await render.findByTestId('loader');
    expect(loader).toBeDefined();
  });

  test('Provider Details page errorScreen', async () => {
    const render = beforeAll({
      route: `/providers/${provider.contract}`,
      networkRequests: {
        provider: () => Promise.resolve(new Error('error')),
      },
    });

    const errorScreen = await render.findByTestId('errorScreen');
    expect(errorScreen).toBeInTheDocument();
  });
});
