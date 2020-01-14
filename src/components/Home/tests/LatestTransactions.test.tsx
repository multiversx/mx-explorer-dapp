import axios from 'axios';
import { renderWithRouter } from 'utils/test-utils';
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
});
