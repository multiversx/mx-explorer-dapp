import axios from 'axios';
import {
  fireEvent,
  renderWithRouter,
  wait,
  config as optionalConfig,
  waitForElement,
} from 'utils/test-utils';
import { blocks, heartbeatstatus } from 'utils/rawData';
import rounds from './rawData/rounds';
import { mockGet } from './../../tests/Validators.test';

export const beforeAll = () => {
  mockGet();
  const mockPost = jest.spyOn(axios, 'post');
  mockPost.mockImplementation((url: string): any => {
    switch (true) {
      case url.includes('/rounds/_search'):
        return Promise.resolve({ data: rounds });
      case url.includes('/blocks/_search'):
        return Promise.resolve({ data: blocks });
    }
  });

  return renderWithRouter({
    route: `/validators/nodes/${heartbeatstatus.message[0].publicKey}`,
    optionalConfig,
  });
};

describe('Node Information', () => {
  test('Node Information page displaying', async () => {
    const render = beforeAll();

    await wait(async () => {
      expect(document.title).toEqual('Node Details • Elrond Explorer');
      expect(render.getByText('Node Information')).toBeDefined();
    });

    const versionNumber = await render.findByTestId('versionNumber');

    expect(versionNumber.innerHTML).toBe('v1.0.77-0-g9d8013a8-dirty/go1.13/linux-amd64');

    expect(render.getByTestId('progresUpTimeBar').id).toBe('100.00% (19 hours)100');
    expect(render.getByTestId('progresDownTimeBar').id).toBe('0.00% (a few seconds)0');

    await wait(async () => {
      expect(render.getByTestId('rounds').childElementCount).toBe(100);
    });

    await wait(async () => {
      expect(render.getByTestId('blocksTable').childElementCount).toBe(25);
    });
  });

  test('Node Information loading state', async () => {
    const render = renderWithRouter({
      route: `/validators/nodes/${heartbeatstatus.message[0].publicKey}`,
      optionalConfig,
    });
    const loader = await waitForElement(() => render.queryByTestId('loader'));
    expect(loader).toBeDefined();
  });

  test('Node Information failed state', async () => {
    mockGet();
    const render = renderWithRouter({
      route: `/validators/nodes/123`,
      optionalConfig,
    });
    await wait(async () => {
      expect(render.getByTestId('errorScreen')).toBeDefined();
    });
  });
});

describe('Validator Details links', () => {
  test('Validator Details Shard link', async () => {
    const render = beforeAll();

    const shardLink = await render.findByTestId('shardLink');

    expect(shardLink.textContent).toBe('Shard 3');

    fireEvent.click(shardLink);

    await wait(async () => {
      expect(document.title).toEqual('Shard Details • Elrond Explorer');
    });
  });
});
