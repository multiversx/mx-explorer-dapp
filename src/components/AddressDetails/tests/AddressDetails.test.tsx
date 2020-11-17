import '@testing-library/jest-dom/extend-expect';
import { wait, beforeAll } from 'utils/test-utils';
import { address } from 'utils/rawData';

describe('Address Details Page', () => {
  test('Address Details page is displaying', async () => {
    const render = beforeAll({
      route: `/addresses/${address.address}`,
    });

    expect(document.title).toEqual('Address Details • Elrond Explorer');

    await wait(async () => {
      const pageInterval = render.getByTestId('pageInterval');
      expect(pageInterval!.innerHTML).toBe('1-50');
    });
  });
  test('Address Details page loading state', async () => {
    const render = beforeAll({
      route: `/addresses/${address.address}`,
    });
    const loader = await render.findByTestId('loader');
    expect(loader).toBeDefined();
  });

  test('Address Details page errorScreen', async () => {
    const render = beforeAll({
      route: `/addresses/${address.address}`,
      networkRequests: {
        address: () => Promise.resolve(new Error('error')),
      },
    });

    const errorScreen = await render.findByTestId('errorScreen');
    expect(errorScreen).toBeInTheDocument();
  });
});
