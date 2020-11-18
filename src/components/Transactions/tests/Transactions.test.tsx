import { wait, waitForElement, fireEvent, act, beforeAll } from 'utils/test-utils';

describe('Transactions Page', () => {
  test('Transactions page loading state', async () => {
    const render = beforeAll({
      route: '/transactions',
    });
    const loader = await render.findByTestId('loader');
    expect(loader.innerHTML).toBeDefined();
    const title = await waitForElement(() => render.queryByTestId('title')!.innerHTML);
    expect(title).toBe('Transactions');
  });

  test('Transactions data is displayed correctly', async () => {
    const render = beforeAll({
      route: '/transactions',
    });
    const pageInterval = await waitForElement(() => render.queryByTestId('pageInterval'));
    expect(pageInterval!.innerHTML).toBe('1-50');

    const table = render.queryByTestId('transactionsTable');
    const numberOfRows = table!.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    expect(numberOfRows).toHaveLength(50);
  });

  test('Transactions pager working', async () => {
    const render = beforeAll({
      route: '/transactions?page=1',
    });

    const pageInterval = await waitForElement(() => render.queryByTestId('pageInterval'));
    expect(pageInterval!.innerHTML).toBe('1-50');
  });
});

describe('Transactions Page Links', () => {
  test('Transaction link', async () => {
    const render = beforeAll({
      route: '/transactions',
    });

    const links = await render.findAllByTestId('transactionLink');
    expect(links[0].textContent).toBe(
      '72d26fd09ed2d2bb649a401428eca1a0...a7b5a11242daf5500990305f600a9a91'
    );

    fireEvent.click(links[0]);
    await act(async () => {
      await wait(async () => {
        expect(document.title).toEqual('Transaction Details • Elrond Explorer');
      });
    });
  });
  test('Shard from link', async () => {
    const render = beforeAll({
      route: '/transactions',
    });

    const links = await render.findAllByTestId('shardFromLink');
    expect(links[0].textContent).toBe('Shard 1');

    fireEvent.click(links[0]);
    await wait(async () => {
      expect(document.title).toEqual('Shard Details • Elrond Explorer');
    });
  });
  test('Shard to link', async () => {
    const render = beforeAll({
      route: '/transactions',
    });

    const links = await render.findAllByTestId('shardToLink');
    expect(links[0].textContent).toBe('Shard 0');

    fireEvent.click(links[0]);
    await wait(async () => {
      expect(document.title).toEqual('Shard Details • Elrond Explorer');
    });
  });
  test('Receiver link', async () => {
    const render = beforeAll({
      route: '/transactions',
    });

    const links = await render.findAllByTestId('receiverLink');
    expect(links[0].textContent).toBe(
      'erd1hqplnafrhnd4zv846wumat2462j...y9jkmwxtp3nwmw8ye9eclr6fq40f044'
    );

    fireEvent.click(links[0]);
    await wait(async () => {
      expect(document.title).toEqual('Account Details • Elrond Explorer');
    });
  });
});
