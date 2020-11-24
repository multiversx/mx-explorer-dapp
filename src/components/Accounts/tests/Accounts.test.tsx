import { fireEvent, wait, beforeAll } from 'utils/test-utils';

describe('Accounts Page', () => {
  test('Accounts page is displaying', async () => {
    const render = beforeAll({
      route: '/accounts',
    });

    expect(document.title).toEqual('Accounts • Elrond Explorer');

    await wait(async () => {
      expect(render.queryByTestId('title')!.innerHTML).toBe('Accounts');
      const table = await render.findByTestId('accountsTable');
      expect(table.childElementCount).toBe(25);
    });
  });

  test('Accounts page loading state', async () => {
    const render = beforeAll({
      route: '/accounts',
    });

    const loader = await render.findByTestId('loader');
    expect(loader.innerHTML).toBeDefined();
  });

  test('Accounts page failed state', async () => {
    const render = beforeAll({
      route: '/accounts',
      networkRequests: {
        accounts: () => Promise.resolve(new Error('error')),
      },
    });

    const failedState = await render.findByTestId('errorScreen');
    expect(failedState.innerHTML).toBeDefined();
  });
});

describe('Accounts Page Links', () => {
  test('Account page link', async () => {
    const render = beforeAll({
      route: '/accounts',
    });

    const link = await render.findByTestId('accountLink0');
    expect(link.textContent).toBe(
      'erd1sea63y47u569ns3x5mqjf4vnygn...9whkk7p6ry4rfpqyd6rd5addqyd9lf2'
    );

    fireEvent.click(link);
    await wait(async () => {
      expect(document.title).toEqual('Account Details • Elrond Explorer');
    });
  });
});
