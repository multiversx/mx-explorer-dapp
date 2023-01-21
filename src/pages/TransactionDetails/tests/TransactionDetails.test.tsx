import { wait, beforeAll } from '__mocks__/test-utils';
import { transactions as doc } from '__mocks__';

describe('Transaction Details Page', () => {
  test('Transaction Details page is displaying', async () => {
    const render = beforeAll({
      route: `/transactions/${doc.txHash}`,
    });
    expect(document.title).toEqual('Transaction Details • MultiversX (previously Elrond) Explorer');
    await wait(async () => {
      expect(render.getByText(doc.txHash)).toBeInTheDocument();
    });
  });

  test('Transaction Details loading state', async () => {
    const render = beforeAll({
      route: `/transactions/${doc.txHash}`,
    });
    const loader = await render.findByTestId('loader');
    expect(loader.innerHTML).toBeDefined();
  });

  test('Transaction Details failed state', async () => {
    const render = beforeAll({
      route: `/transactions/${doc.txHash}`,
      networkRequests: {
        transaction: () => Promise.resolve(new Error('error')),
      },
    });
    const failedScreen = await render.findByText('Unable to locate this transaction hash');
    expect(failedScreen.innerHTML).toBeDefined();
  });
});
