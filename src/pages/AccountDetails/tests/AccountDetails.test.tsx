import '@testing-library/jest-dom/extend-expect';
import { wait, beforeAll } from 'utils/test-utils';
import { account } from 'utils/rawData';

describe('Account Details Page', () => {
  test('Account Details page is displaying', async () => {
    const render = beforeAll({
      route: `/accounts/${account.address}`,
    });

    await wait(async () => {
      expect(document.title).toEqual('Account Details • MultiversX (previously Elrond) Explorer');

      const pageInterval = render.getByTestId('pageInterval');
      expect(pageInterval!.innerHTML).toBe('1');
    });

    const address = await render.findByTestId('address');
    expect(address.textContent).toBe(account.address);

    const transactionsTable = await render.findByTestId('transactionsTable');
    expect(transactionsTable).toBeDefined();
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
        account: () => Promise.resolve(new Error('error')),
      },
    });

    const errorScreen = await render.findByTestId('errorScreen');
    expect(errorScreen).toBeInTheDocument();
  });
});
