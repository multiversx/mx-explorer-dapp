import axios from 'axios';
import { renderWithRouter, wait } from 'utils/test-utils';
import blocks from './blocks';
import data from './transactions';

describe('Latest Transactions', () => {
  test('Latest Transactions component is displaying', async () => {
    const mockPost = jest.spyOn(axios, 'post');
    mockPost.mockReturnValueOnce(Promise.resolve({ data: blocks }));
    mockPost.mockReturnValueOnce(Promise.resolve({ data }));
    const render = renderWithRouter({
      route: '/',
    });

    const transactions = await render.findByTestId('transactionsList');
    expect(transactions!.childElementCount).toBe(20);
  });
  test('Latest Transactions component loading state', async () => {
    const render = renderWithRouter({
      route: '/',
    });
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
