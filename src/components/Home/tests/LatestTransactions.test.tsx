import axios from 'axios';
import { fireEvent, renderWithRouter, wait } from 'utils/test-utils';
import blocks from './blocks';
import data from './transactions';
import { beforeAll } from './LatestBlocks.test';

describe('Latest Transactions', () => {
  test('Latest Transactions component is displaying', async () => {
    // const mockPost = jest.spyOn(axios, 'post');
    // mockPost.mockReturnValueOnce(Promise.resolve({ data: blocks }));
    // mockPost.mockReturnValueOnce(Promise.resolve({ data }));
    // const render = renderWithRouter({
    //   route: '/',
    // });
    const render = beforeAll();
    const transactions = await render.findByTestId('transactionsList');
    expect(transactions!.childElementCount).toBe(20);
  });
  test('Latest Transactions component loading state', async () => {
    const render = beforeAll();
    expect(render.queryByTestId('transactionsLoader')).toBeDefined();
  });
  test('Latest Transactions component failing state', async () => {
    const mockPost = jest.spyOn(axios, 'post');
    mockPost.mockRejectedValueOnce(new Error('the error'));
    mockPost.mockRejectedValueOnce(new Error('the error'));

    const render = renderWithRouter({
      route: '/',
    });
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
