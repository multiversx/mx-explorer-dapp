import axios from 'axios';
import { renderWithRouter, wait, meta, config as optionalConfig } from 'utils/test-utils';
import {
  blocks,
  validators,
  validatorsdoc,
  block as doc,
  statistics,
  heartbeatstatus,
} from 'utils/rawData';

const beforeAll = (success = true) => {
  const mockGet = jest.spyOn(axios, 'get');
  mockGet.mockImplementation((url: string): any => {
    switch (true) {
      // --- page load ---
      case url.includes('/tps/_doc/meta'):
        return Promise.resolve({ data: meta });
      case url.includes(`/node/heartbeatstatus`):
        return Promise.resolve({ data: { data: heartbeatstatus, code: 'successful' } });
      case url.includes('/validator/statistics'):
        return Promise.resolve({ data: { data: statistics, code: 'successful' } });
      case url.endsWith('/validators'):
        return Promise.resolve({ data: validators });
      // --- page load ---
      case url.includes(`/validators`):
        return Promise.resolve({ data: validatorsdoc });
      case url.includes(`/blocks/${doc.id}`) && success:
        return Promise.resolve({ data: doc });
      case url.includes('/blocks'):
        return Promise.resolve({ data: blocks });
    }
  });

  return renderWithRouter({
    route: `/blocks/${doc.id}`,
    optionalConfig,
  });
};

describe('Block Details', () => {
  test('Block Details page is displaying', async () => {
    const render = beforeAll();
    expect(document.title).toEqual('Block Details • Elrond Explorer');
    await wait(async () => {
      expect(render.queryByTestId('title')!.innerHTML).toBe('Block Details');
    });
    expect(render.getByText(doc.nonce.toString())).toBeInTheDocument();
  });
  test('Block Details page loading state', async () => {
    const render = beforeAll();

    const loader = await render.findByTestId('loader');
    expect(loader.innerHTML).toBeDefined();
  });
  test('Block Details page failed state', async () => {
    const render = beforeAll(false);

    const failedState = await render.findByText('Unable to locate this block hash');
    expect(failedState.innerHTML).toBeDefined();
  });
});
