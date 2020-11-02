import { beforeAll } from 'utils/test-utils';

import { miniblock, miniblockTransactions } from 'utils/rawData';

describe('MiniBlock Details Page', () => {
  test('MiniBlock Details page is displaying', async () => {
    const render = beforeAll({
      route: `/miniblocks/${miniblock.miniBlockHash}`,
      networkRequests: {
        transactions: () => Promise.resolve({ data: miniblockTransactions }),
      },
    });
    expect(document.title).toEqual('Miniblock Details • Elrond Explorer');
    const pageTitle = await render.findByTestId('pageTitle');
    expect(pageTitle.textContent).toBe('Miniblock Details');
  });
  test('MiniBlock Details page loading state', async () => {
    const render = beforeAll({
      route: `/miniblocks/${miniblock.miniBlockHash}`,
    });

    const loader = await render.findByTestId('loader');
    expect(loader.innerHTML).toBeDefined();
  });
  test('MiniBlock Details page failed state', async () => {
    const render = beforeAll({
      route: `/miniblocks/${miniblock.miniBlockHash}`,
      networkRequests: {
        miniblock: () => Promise.resolve(new Error('error')),
      },
    });

    const failedState = await render.findByText('Unable to locate this miniblock hash');
    expect(failedState.innerHTML).toBeDefined();
  });
});
