import { beforeAll } from 'utils/test-utils';

describe('NetworkHealth tests', () => {
  test('NetworkHealth data is displaying', async () => {
    const render = beforeAll({
      route: `/`,
    });
    const blocks = await render.findByTestId('blocks');
    expect(blocks.innerHTML).toBe('6,379,407');

    const accounts = await render.findByTestId('accounts');
    expect(accounts.innerHTML).toBe('60,655');

    const transactions = await render.findByTestId('transactions');
    expect(transactions.innerHTML).toBe('247,378');
  }, 10000);
});
