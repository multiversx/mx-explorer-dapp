import axios from 'axios';
import { renderWithRouter, wait, meta, config as optionalConfig } from 'utils/test-utils';
import {
  transactions as doc,
  heartbeatstatus,
  statistics,
  validators,
  validatorsdoc,
} from 'utils/rawData';

const beforeAll = (success = true) => {
  const mockGet = jest.spyOn(axios, 'get');
  mockGet.mockImplementation((url: string): any => {
    switch (true) {
      case url.includes('/tps/meta'):
        return Promise.resolve({ data: meta });
      case url.includes(`/node/heartbeatstatus`):
        return Promise.resolve({ data: heartbeatstatus });
      case url.includes('/validator/statistics'):
        return Promise.resolve({ data: statistics });
      case url.endsWith('/validators'):
        return Promise.resolve({ data: validators });
      case url.includes('validators/1_36'):
        return Promise.resolve({ data: validatorsdoc });
      case url.includes(`/transactions/${doc.hash}`) && success:
        return Promise.resolve({ data: doc });
      default:
        return Promise.resolve(new Error('error'));
    }
  });
  return renderWithRouter({
    route: `/transactions/${doc.hash}`,
    optionalConfig,
  });
};

describe('Transaction Details', () => {
  test('Transaction Details page is displaying', async () => {
    const render = beforeAll();
    expect(document.title).toEqual('Transaction Details • Elrond Explorer');
    await wait(async () => {
      expect(render.getByText(doc.hash)).toBeInTheDocument();
    });
  });

  test('Transaction Details loading state', async () => {
    const render = beforeAll();
    const loader = await render.findByTestId('loader');
    expect(loader.innerHTML).toBeDefined();
  });

  test('Transaction Details failed state', async () => {
    const render = beforeAll(false);
    const failedScreen = await render.findByText('Unable to locate this transaction hash');
    expect(failedScreen.innerHTML).toBeDefined();
  });
});
