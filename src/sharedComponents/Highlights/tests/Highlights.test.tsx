import { beforeAll } from 'utils/test-utils';

describe('Highlights tests', () => {
  test('Highlights data is displaying', async () => {
    const render = beforeAll({
      route: `/`,
    });
    const metaEpochTimeRemaining = await render.findByTestId('metaEpochTimeRemaining');
    expect(metaEpochTimeRemaining.innerHTML).toBe('0:43 remaining');

    const metaBlocks = await render.findByTestId('metaBlocks');
    expect(metaBlocks.innerHTML).toBe('6,032,053');

    const metaShards = await render.findByTestId('metaShards');
    expect(metaShards.innerHTML).toBe('3');

    const metaWallets = await render.findByTestId('metaWallets');
    expect(metaWallets.innerHTML).toBe('59,707');

    const metaTransactions = await render.findByTestId('metaTransactions');
    expect(metaTransactions.innerHTML).toBe('234,191');
  });
});
