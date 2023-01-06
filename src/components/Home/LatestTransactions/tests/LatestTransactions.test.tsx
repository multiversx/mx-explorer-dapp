import { fireEvent, wait, waitForElement, beforeAll } from 'utils/test-utils';

describe('Latest Transactions', () => {
  test('Latest Transactions component is displaying', async () => {
    const render = beforeAll({
      route: '/',
    });
    const transactions = await render.findByTestId('transactionsList');
    expect(transactions!.childElementCount).toBe(1); // 1 because of the css animation
  });
  test('Latest Transactions component loading state', async () => {
    const render = beforeAll({
      route: '/',
    });
    const transactionsLoader = await waitForElement(() =>
      render.queryByTestId('transactionsLoader')
    );
    expect(transactionsLoader).toBeDefined();
  });
  test('Latest Transactions component failing state', async () => {
    const render = beforeAll({
      route: '/',
      networkRequests: {
        transactions: () => Promise.resolve(new Error('error')),
      },
    });

    await wait(async () => {
      expect(render.queryByText('Unable to load transactions')).toBeDefined();
    });
  });
});

describe('Latest Transactions Links', () => {
  test('Wiew all Transactions', async () => {
    const render = beforeAll({
      route: '/',
    });

    const link = await render.findByText('View All Transactions');
    fireEvent.click(link);
    await wait(async () => {
      expect(document.title).toEqual('Transactions • MultiversX (Elrond) Explorer');
    });
  });
  test('TxHash link', async () => {
    const render = beforeAll({
      route: '/',
    });

    const link = await render.findByTestId('transactionLink0');

    fireEvent.click(link);
    await wait(async () => {
      expect(document.title).toEqual('Transaction Details • MultiversX (Elrond) Explorer');
    });
  });
  test('Tx To link', async () => {
    const render = beforeAll({
      route: '/',
    });

    const link = await render.findByTestId('transactionLinkTo0');

    fireEvent.click(link);
    await wait(async () => {
      expect(document.title).toEqual('Account Details • MultiversX (Elrond) Explorer');
    });
  });
});
