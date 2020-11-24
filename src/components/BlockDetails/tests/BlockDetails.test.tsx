import { wait, beforeAll } from 'utils/test-utils';

import { validatorsdoc, block as doc } from 'utils/rawData';

describe('Block Details Page', () => {
  test('Block Details page is displaying', async () => {
    const render = beforeAll({
      route: `/blocks/${doc.hash}`,
      networkRequests: {
        validators: () => Promise.resolve({ data: validatorsdoc }),
      },
    });
    expect(document.title).toEqual('Block Details • Elrond Explorer');
    await wait(async () => {
      expect(render.queryByTestId('title')!.innerHTML).toBe('Block Details');
    });
    expect(render.getByText(doc.nonce.toString())).toBeInTheDocument();
  });
  test('Block Details page loading state', async () => {
    const render = beforeAll({
      route: `/blocks/${doc.hash}`,
    });

    const loader = await render.findByTestId('loader');
    expect(loader.innerHTML).toBeDefined();
  });
  test('Block Details page failed state', async () => {
    const render = beforeAll({
      route: `/blocks/${doc.hash}`,
      networkRequests: {
        block: () => Promise.resolve(new Error('error')),
      },
    });

    const failedState = await render.findByText('Unable to locate this block hash');
    expect(failedState.innerHTML).toBeDefined();
  });
});
