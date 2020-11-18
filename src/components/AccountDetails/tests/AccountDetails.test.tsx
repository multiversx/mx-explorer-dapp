import '@testing-library/jest-dom/extend-expect';
import { wait, beforeAll } from 'utils/test-utils';
import { account } from 'utils/rawData';

describe('Account Details Page', () => {
  test('Account Details page is displaying', async () => {
    const render = beforeAll({
      route: `/accounts/${account.address}`,
    });

    expect(document.title).toEqual('Account Details • Elrond Explorer');

    await wait(async () => {
      const pageInterval = render.getByTestId('pageInterval');
      expect(pageInterval!.innerHTML).toBe('1-50');
    });
  });
  test('Account Details page loading state', async () => {
    const render = beforeAll({
      route: `/accounts/${account.address}`,
    });
    const loader = await render.findByTestId('loader');
    expect(loader).toBeDefined();
  });

  test('Account Details page errorScreen', async () => {
    const render = beforeAll({
      route: `/accounts/${account.address}`,
      networkRequests: {
        address: () => Promise.resolve(new Error('error')),
      },
    });

    const errorScreen = await render.findByTestId('errorScreen');
    expect(errorScreen).toBeInTheDocument();
  });
});
