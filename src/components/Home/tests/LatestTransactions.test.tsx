import { fireEvent, wait, waitForElement } from 'utils/test-utils';
import { beforeAll } from './LatestBlocks.test';

describe('Latest Transactions', () => {
  test('Latest Transactions component is displaying', async () => {
    const render = beforeAll();
    const transactions = await render.findByTestId('transactionsList');
    expect(transactions!.childElementCount).toBe(50);
  });
  test('Latest Transactions component loading state', async () => {
    const render = beforeAll();
    const transactionsLoader = await waitForElement(() =>
      render.queryByTestId('transactionsLoader')
    );
    expect(transactionsLoader).toBeDefined();
  });
  test('Latest Transactions component failing state', async () => {
    const render = beforeAll(false, true);

    await wait(async () => {
      expect(render.queryByText('Unable to load transactions')).toBeDefined();
    });
  });
});

describe('Latest Transactions Links', () => {
  test('Wiew all Transactions', async () => {
    const render = beforeAll();

    const link = render.getByText('View All Transactions');
    fireEvent.click(link);
    await wait(async () => {
      expect(document.title).toEqual('Transactions • Elrond Explorer');
    });
  });
  test('TxHash link', async () => {
    const render = beforeAll();

    const link = await render.findByTestId('transactionLink0');

    fireEvent.click(link);
    await wait(async () => {
      expect(document.title).toEqual('Transaction Details • Elrond Explorer');
    });
  });
  test('Tx To link', async () => {
    const render = beforeAll();

    const link = await render.findByTestId('transactionLinkTo0');

    fireEvent.click(link);
    await wait(async () => {
      expect(document.title).toEqual('Address Details • Elrond Explorer');
    });
  });
});
