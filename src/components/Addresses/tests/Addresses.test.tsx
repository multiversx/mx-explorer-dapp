import { fireEvent, wait, beforeAll } from 'utils/test-utils';

describe('Addresses Page', () => {
  test('Addresses page is displaying', async () => {
    const render = beforeAll({
      route: '/addresses',
    });

    expect(document.title).toEqual('Addresses • Elrond Explorer');

    await wait(async () => {
      expect(render.queryByTestId('title')!.innerHTML).toBe('Addresses');
      const table = await render.findByTestId('addressesTable');
      expect(table.childElementCount).toBe(25);
    });
  });

  test('Addresses page loading state', async () => {
    const render = beforeAll({
      route: '/addresses',
    });

    const loader = await render.findByTestId('loader');
    expect(loader.innerHTML).toBeDefined();
  });

  test('Addresses page failed state', async () => {
    const render = beforeAll({
      route: '/addresses',
      networkRequests: {
        addresses: () => Promise.resolve(new Error('error')),
      },
    });

    const failedState = await render.findByTestId('errorScreen');
    expect(failedState.innerHTML).toBeDefined();
  });
});

describe('Addresses Page Links', () => {
  test('Address page link', async () => {
    const render = beforeAll({
      route: '/addresses',
    });

    const link = await render.findByTestId('addressLink0');
    expect(link.innerHTML).toBe('erd1sea63y47u569ns3x5mqjf4vnygn9whkk7p6ry4rfpqyd6rd5addqyd9lf2');

    fireEvent.click(link);
    await wait(async () => {
      expect(document.title).toEqual('Address Details • Elrond Explorer');
    });
  });
});
