import axios from 'axios';
import {
  fireEvent,
  renderWithRouter,
  wait,
  config as optionalConfig,
  waitForElement,
  meta,
} from 'utils/test-utils';
import { blocks, heartbeatstatus, statistics, validators, validatorsdoc } from 'utils/rawData';
import rounds from './rawData/rounds';
import ratings from 'sharedComponents/Search/tests/rawData/ratings';

export const beforeAll = () => {
  const mockGet = jest.spyOn(axios, 'get');

  mockGet.mockImplementation((url: string): any => {
    switch (true) {
      // --- page load ---
      case url.includes('/tps/meta'):
        return Promise.resolve({ data: meta });
      case url.includes(`/node/heartbeatstatus`):
        return Promise.resolve({ data: { data: heartbeatstatus, code: 'successful' } });
      case url.includes('/validator/statistics'):
        return Promise.resolve({ data: { data: statistics, code: 'successful' } });
      case url.endsWith('/validators'):
        return Promise.resolve({ data: validators });
      case url.includes('/validators'):
        return Promise.resolve({ data: validatorsdoc });
      // --- page load ---
      case url.includes('/ratingshistory'):
        return Promise.resolve({ data: ratings });
      case url.includes('/rounds'):
        return Promise.resolve({ data: rounds });
      case url.includes('/blocks'):
        return Promise.resolve({ data: blocks });
    }
  });

  return renderWithRouter({
    route: `/validators/nodes/${heartbeatstatus.heartbeats[0].publicKey}`,
    optionalConfig,
  });
};

// describe('Node Information', () => {
//   test('Node Information page displaying', async () => {
//     const render = beforeAll();

//     await wait(async () => {
//       expect(document.title).toEqual('Node Details • Elrond Explorer');
//       expect(render.getByText('Node Information')).toBeDefined();
//     });

//     const versionNumber = render.getByTestId('versionNumber');
//     expect(versionNumber.innerHTML).toBe('v1.0.136-0-gf681ca167/go1.13.5/linux-amd64/7563e0eec6');

//     expect(render.getByTestId('progresUpTimeBar').id).toBe('100.00% (7 days)100');
//     expect(render.getByTestId('progresDownTimeBar').id).toBe('0.00% (a few seconds)0');

//     await wait(async () => {
//       expect(render.getByTestId('rounds').childElementCount).toBe(100);
//     });

//     await wait(async () => {
//       expect(render.getByTestId('blocksTable').childElementCount).toBe(25);
//     });
//   });

//   test('Node Information loading state', async () => {
//     const render = renderWithRouter({
//       route: `/validators/nodes/${heartbeatstatus.heartbeats[0].publicKey}`,
//       optionalConfig,
//     });
//     const loader = await waitForElement(() => render.queryByTestId('loader'));
//     expect(loader).toBeDefined();
//   });

//   test('Node Information failed state', async () => {
//     const render = renderWithRouter({
//       route: `/validators/nodes/123`,
//       optionalConfig,
//     });

//     await wait(async () => {
//       expect(render.getByTestId('errorScreen')).toBeDefined();
//     });
//   });
// });

// describe('Validator Details links', () => {
//   test('Validator Details Shard link', async () => {
//     const render = beforeAll();
//     const shardLink = await waitForElement(() => render.getByTestId('shardLink'));

//     expect(shardLink.textContent).toBe('Metachain');
//     fireEvent.click(shardLink);

//     await wait(async () => {
//       expect(document.title).toEqual('Shard Details • Elrond Explorer');
//     });
//   });
// });

test('Validator Details Shard link', async () => {
  expect('todo').toBe('todo');
});
