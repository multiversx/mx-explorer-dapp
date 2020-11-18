import { beforeAll } from 'utils/test-utils';

describe('Highlights tests', () => {
  test('Highlights data is displaying', async () => {
    const render = beforeAll({
      route: `/`,
    });
    const epochTimeRemaining = await render.findByTestId('epochTimeRemaining');
    expect(epochTimeRemaining.innerHTML).toBe('04:10 remaining');

    const blocks = await render.findByTestId('blocks');
    expect(blocks.innerHTML).toBe('6,379,407');

    const shards = await render.findByTestId('shards');
    expect(shards.innerHTML).toBe('3');

    const accounts = await render.findByTestId('accounts');
    expect(accounts.innerHTML).toBe('59,707');

    const transactions = await render.findByTestId('transactions');
    expect(transactions.innerHTML).toBe('234,191');
  });
});
