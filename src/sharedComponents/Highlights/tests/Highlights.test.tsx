import { beforeAll } from 'utils/test-utils';

describe('Highlights tests', () => {
  test('Highlights data is displaying', async () => {
    const render = beforeAll({
      route: `/`,
    });
    const metaEpochTimeRemaining = await render.findByTestId('metaEpochTimeRemaining');
    expect(metaEpochTimeRemaining.innerHTML).toBe('0:43 remaining');

    const metaBlocks = await render.findByTestId('metaBlocks');
    expect(metaBlocks.innerHTML).toBe('9,480');

    const metaShards = await render.findByTestId('metaShards');
    expect(metaShards.innerHTML).toBe('5');

    const metaPeakTps = await render.findByTestId('metaPeakTps');
    expect(metaPeakTps.innerHTML).toBe('858');

    const metaTransactions = await render.findByTestId('metaTransactions');
    expect(metaTransactions.innerHTML).toBe('3,332,899');
  });
});
