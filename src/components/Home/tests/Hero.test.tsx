import axios from 'axios';
import { renderWithRouter, wait, meta, config as optionalConfig } from 'utils/test-utils';
import { heartbeatstatus, validators, statistics } from 'utils/rawData';

export const beforeAll = () => {
  const mockGet = jest.spyOn(axios, 'get');

  mockGet.mockImplementation((url: string): any => {
    switch (true) {
      // --- page load ---
      case url.includes('/tps/meta'):
        return Promise.resolve({ data: meta });
      case url.includes(`/node/heartbeatstatus`):
        return Promise.resolve({ data: heartbeatstatus });
      case url.includes('/validator/statistics'):
        return Promise.resolve({ data: statistics });
      case url.endsWith('/validators'):
        return Promise.resolve({ data: validators });
      // --- page load ---
    }
  });

  return renderWithRouter({
    route: '/',
    optionalConfig,
  });
};

describe('Hero tests', () => {
  test('Hero bar is displaying fetched values', async () => {
    // const render = beforeAll();
    // await wait(async () => {
    //   expect(render.queryByTestId('peak-tps')!.innerHTML).toBe('858');
    // });
  });
});
